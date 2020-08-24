import React, { useEffect, useCallback } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import '../App.css'
const { DateTime } = require("luxon");

const dummy_exposures = { "181702660f5033305b36e34f014322d1d76ec86cf378eaf1f6e36aadd8892d89":
    {
        "date": "2020-08-15",
        "keysInFileCount": 2675,
        "matches": [{ "timestamp": "2020-08-17T06:36:33.000+02:00", "count": 1 },
                    { "timestamp": "2020-08-18T06:42:59.000+02:00", "count": 1 },
                    { "timestamp": "2020-08-19T08:25:18.000+02:00", "count": 1 },
                    { "timestamp": "2020-08-20T13:43:36.000+02:00", "count": 1 },
                    { "timestamp": "2020-08-21T13:59:18.000+02:00", "count": 1 },
                    { "timestamp": "2020-08-22T14:50:07.000+02:00", "count": 1 },
                    { "timestamp": "2020-08-23T16:14:08.000+02:00", "count": 0 }]
    }}

const formatted_dummy_exposures = Object.keys(dummy_exposures).map( hash => {
        const date = DateTime.fromISO(dummy_exposures[hash].date).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
        return (
            <div>
                <Card className="mb-2">
                    <Card.Header>
                        Schlüsseldatei vom {date} mit {dummy_exposures[hash].keysInFileCount} Schlüsseln
                    </Card.Header>
                    <Card.Body>
                        <Table className='mt-2' striped bordered size="sm">
                            <thead>
                                <th>Anzahl Treffer</th>
                                <th>Überprüfungszeitpunkt</th>
                            </thead>
                            <tbody>
                                {
                                    dummy_exposures[hash].matches.map( m => {
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
            </div>
        )
    })

const faq_entries = [
    {
        'title': 'Wo findet sich die Begegnungsüberprüfungsdatei?',
        'content': <div><h4>Bei iOS Geräten</h4>
            <ul>
                <li>Einstellungen</li>
                <li>Datenschutz</li>
                <li>Health</li>
                <li>COVID 19 Begegnungsaufzeichnungen</li>
                <li>Begegnungsüberprüfungen</li>
                <li>Mit PIN oder FaceID authentifizieren</li>
                <li>ganz nach unten scrollen</li>
                <li>Begegnungsüberprüfungen exportieren</li>
            </ul>
        </div>
    },
    {
        'title': 'Was bedeutet die Begegnungsüberprüfung?',
        'content': <div>Bei der Begegnungsüberprüfung wird periodisch verglichen, ob eine Begegnung mit einer als positiv getesten Person stattgefunden hat. <br/>
            <Card>
                <Card.Header>Beispiel</Card.Header>
                <Card.Body>
                    {formatted_dummy_exposures}
                    <ul>
                        <li>Bei Überprüfung am 17.-22.8 wurde jeweils eine Begegnung mit einer positiv getesteten Person festgestellt, deren Schlüssel in der Schlüsseldatei vom 15.8. enthalten ist.</li>
                        <li>Am 23.8. wurde keine Begegnung mehr festgestellt. Da das Smartphone Begegnungsinformationen für 14 Tage speichert und danach löscht, war die Begegnung vermutlich am 8.8. (8 = 22 - 14, 22: Tag des letzten Treffer).</li>
                        <li>Da der Schlüssel in der Schlüsseldatei vom 15.8. enthalten ist, hat die Person ihr positives Ergebnis vermutlich am 14.8. in die App eingetragen.</li>
                    </ul>
                </Card.Body>
            </Card>

            </div>
    },
    {
        'title': 'Die Corona-Warn-App zeigt Risiko-Begegnungen mit niedrigem Risiko. Kann ich herausfinden, wann diese gewesen sind?',
        'content': <div>
            Dies ist aktuell leider nicht möglich. Wie oben bei "Was bedeutet Begegnungsüberprüfung?" dargestellt, können aber Schätzungen anhand der Begegnungsüberprüfungsdaten abgeleitet werden. <br/>
            Im Backlog der Corona-Warn-App wird eine Erweiterung der App um die Bereitstellung dieser Informationen <a href="https://github.com/corona-warn-app/cwa-backlog/issues/23" target="_blank">diskutiert</a>.
        </div>
    },
    {
        'title': 'Weitere Informationen',
        'content': <ul>
            <li><a href="https://www.coronawarn.app/de/faq/" target="_blank">FAQ</a> zur Corona-Warn-App.</li>
            <li><a href="https://ctt.pfstr.de/" target="_blank">Dashboard</a> zur Nutzung der Corona-Warn-App von Jan Pfister.</li>
            <li><a href="https://micb25.github.io/dka/" target="_blank">Dashboard</a> zur Nutzung der Corona-Warn-App von Michael Böhme.</li>
            <li><a href="https://github.com/mh-/diagnosis-keys/" target="_blank">Tool</a> zur Analyse der Diagnoseschlüsseldateien von Michael Hübler.</li>
        </ul>
    },
    {
        'title': 'Werden die Bewegungsüberprüfungsdaten bei der Analyse gespeichert oder auf fremde Server transferiert?', 
        'content': 'Die Analyse der Bewegungsüberprüfugnsdateien findet im Browser des ausführenden Geräts statt, es werden keine Bewegungsüberprüfungsdateien mit fremden Servern ausgetauscht. Die Seite setzt auf einen datensparsamen Ansatz und nutzt keine Cookies.'
    },
    {
        'title': 'Über diese Seite',
        'content': <div>
                Der Quelltext dieser Applikation findet sich auf <a href="https://github.com/felixlen/ena_log" target="_blank">GitHub</a> unter MIT-Lizenz.<br />
                Herzlichen Dank an <a href="https://pfstr.de" target="_blank">Jan Pfister</a> für das Bereitstellen der Datenschlüsseldatei.<br />
                (c) 2020 <a href="https://www.felixlenders.de" target="_blank">Felix Lenders</a>.
            </div>
    },
]

const Info = () => {
    return (
        <Row className="mt-2">
            <Col>
                <Accordion>
                {faq_entries.map( (e, i) => {
                    return (
                        <Card key={i}>
                            <Accordion.Toggle as={Card.Header} eventKey={i.toString()}>
                                {e.title}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={i.toString()}>
                                <Card.Body>
                                    {e.content}
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    )
                })}
                </Accordion>
            </Col>
        </Row>
    )
}

export default Info