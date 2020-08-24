import React, { useEffect, useCallback } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import { useSelector, useDispatch } from 'react-redux'
import { fetchKeys, readENALog } from './diagnosisKeysSlice'
import { useDropzone } from 'react-dropzone'
import '../App.css'
const { DateTime } = require("luxon");

const DiagnosisKeys = () => {

    const dispatch = useDispatch()
    const status = useSelector(state => state.diagnosisKeys.status)
    const enastatus = useSelector(state => state.diagnosisKeys.enastatus)
    const exposures = useSelector(state => state.diagnosisKeys.exposures)

    const onDrop = useCallback(acceptedFiles => {
        if (enastatus==='uninitialized' && acceptedFiles.length === 1) {
            dispatch(readENALog(acceptedFiles[0]))
        }
    }, [dispatch, enastatus])

    const {getRootProps, getInputProps} = useDropzone({onDrop})

    useEffect( () => {
        dispatch(fetchKeys())
    }, [dispatch])

    const hashes_and_dates = []
    Object.keys(exposures).map( key => {
        hashes_and_dates.push([key, exposures[key].date])
    })
    const sorted_hashes_and_dates = hashes_and_dates.sort( (a,b) => {return a[1] > b[1] ? 1 : -1})

    if (status === 'loading' || status === 'uninitialized') {
        return (
            <Row className="mt-2">
                <Col>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Lade Diagnoseschlüssel...</span>
                    </Spinner>
                </Col>
            </Row>
        )
    }
    else if (status === 'error') {
        return (
            <Row className="mt-2">
                <Col>
                    <p>Beim Laden der Diagnoseschlüsselinformationen ist ein Fehler aufgetreten.</p>
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Row className="mt-2">
                <Col>
                    {enastatus === 'uninitialized' &&
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                                <p>Um Begegnungsüberprüfungsdatei zu analysieren, klicken oder ziehen.</p>
                        </div>
                    }
                    {enastatus === 'loading' &&
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Lade Begegnungsüberprüfungsdatei</span>
                        </Spinner>
                    }
                    { enastatus === 'error' &&
                        <p>Beim Laden der Begegnungsüberprüfungen ist ein Fehler aufgetreten.</p>
                    }
                    { enastatus === 'loaded' && sorted_hashes_and_dates.length === 0 &&
                        <p>Bei Begegnungsüberprüfungen wurden keine Treffer mit positiv getester Person gefunden.</p>
                    }
                    { enastatus === 'loaded' && sorted_hashes_and_dates.length > 0 &&
                        sorted_hashes_and_dates.map( hd => {
                            const hash = hd[0]
                            const date = DateTime.fromISO(hd[1]).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
                            return (
                                <Card className="mb-2">
                                    <Card.Header>
                                        Schlüsseldatei vom {date} mit {exposures[hash].keysInFileCount} Schlüsseln
                                    </Card.Header>
                                    <Card.Body>
                                        <Table striped bordered size="sm">
                                            <thead>
                                                <th>Anzahl Treffer</th>
                                                <th>Überprüfungszeitpunkt</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    exposures[hash].matches.map( m => {
                                                        const checkDate = DateTime.fromISO(m.timestamp).toLocaleString(DateTime.DATETIME_SHORT)
                                                        return (
                                                            <tr>
                                                                <td>{m.count}</td>
                                                                <td>{checkDate}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            )
                        })
                    }
                </Col>
            </Row>
        )
    }
}

export default DiagnosisKeys