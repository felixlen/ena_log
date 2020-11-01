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
        hashes_and_dates.push([key, exposures[key].date, exposures[key].probable_date])
    })
    const sorted_hashes_and_dates = hashes_and_dates.sort( (a,b) => {
        if (a[1] !== null) {
            if (b[1] === null) {
                return a[1] > b[2] ? 1 : -1
            }
            return a[1] > b[1] ? 1 : -1
        }
        if (b[1] !== null) {
            return a[2] > b[1] ? 1 : -1
        }
        return a[2] > b[2] ? 1 : -1
    })

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
                            let date_string = ""
                            const date = DateTime.fromISO(hd[1])
                            const probable_date = DateTime.fromISO(hd[2])
                            if (date.isValid) {
                                date_string = "vom " + date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
                            }
                            else if (probable_date.isValid) {
                                date_string = "wahrscheinlich vom " + probable_date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
                            }
                            return (
                                <Card className="mb-2">
                                    <Card.Header>
                                        Schlüsseldatei {date_string} mit {exposures[hash].keysInFileCount} Schlüsseln
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
                                                        const timestamp = DateTime.fromISO(m.timestamp)
                                                        let checkDate = m.timestamp
                                                        if (timestamp.isValid) {
                                                            checkDate = timestamp.toLocaleString(DateTime.DATETIME_SHORT)
                                                        }
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