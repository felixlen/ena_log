import React, { useEffect, useCallback } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import '../App.css'

const Info = () => {
    return (
        <Row className='mainRow'>
            <Row>
                <Col>
                    <p>Der Quelltext dieser Applikation findet sich auf <a href="https://github.com/felixlen/ena_log" target="_blank">GitHub</a> unter MIT-Lizenz.</p>
                    <p>Herzlichen Dank an <a href="https://pfstr.de" target="_blank">Jan Pfister</a> für das Bereitstellen der Datenschlüsseldatei.</p>
                    <p>(c) 2020 <a href="https://www.felixlenders.de" target="_blank">Felix Lenders</a>.</p>
                </Col>
            </Row>
        </Row>
    )
}

export default Info