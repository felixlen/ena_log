import React, { useEffect, useCallback, useRef } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSelector, useDispatch } from 'react-redux'
import { fetchKeys, readENALog } from './diagnosisKeysSlice'
import { useDropzone } from 'react-dropzone'
import '../App.css';

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
            <Row className='mainRow'>
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
            <Row className='mainRow'>
                <Col>
                    <p>Ein Fehler ist beim Laden der Diagnoseschlüsselinformationen aufgetreten.</p>
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Row className='mainRow'>
                <Col>
                    {enastatus === 'uninitialized' &&
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                                <p>Um Begegnungsdateien zu analysieren, klicken oder ziehen.</p>
                        </div>
                    }
                    {enastatus === 'loading' &&
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Lade Begegnungslog...</span>
                        </Spinner>
                    }
                    { enastatus === 'loaded' && sorted_hashes_and_dates.length === 0 &&
                        <p>Es sind keine Begegnungen mit positiv getester Person in der Log-Datei gespeichert.</p>
                    }
                    { enastatus === 'loaded' && sorted_hashes_and_dates.length > 0 &&
                        sorted_hashes_and_dates.map( hd => {
                            const hash = hd[0]
                            const date = hd[1]
                            return (
                                <div>
                                    <Row className='mt-4'>
                                        <Col>Schlüsseldatei vom {date} mit {exposures[hash].keysInFileCount} Schlüsseln:</Col>
                                    </Row>
                                    {
                                        exposures[hash].matches.map( m => {
                                            return (
                                                <Row>
                                                    <Col className='ml-5'>{m.count} {m.count == 1 ? 'Begegnung' : 'Begegnungen'} bei Überprüfung am {m.timestamp}</Col>
                                                </Row>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </Col>
            </Row>
        )
    }
}

export default DiagnosisKeys