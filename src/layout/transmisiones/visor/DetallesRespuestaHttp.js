import React from 'react'

import ListGroupItem from './ListGroupItem'
import { Accordion, Card, Container, ListGroup } from 'react-bootstrap'
import ReactJson from 'react-json-view'
import ComponentesHTTP from 'componentes/http/ComponentesHTTP'


const DetallesRespuestaHttp = ({res}) => {
    if (!res) return null

    console.log(res)

    return (
        <Accordion defaultActiveKey="0" className="my-3">
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
                    Respuesta
                </Accordion.Toggle>

                <Accordion.Collapse eventKey="0">
                    <Container fluid>
                        <ListGroup variant="flush" className="border-bottom border-lg-bottom-0">
                            <ListGroup variant="flush" className="border-bottom border-lg-bottom-0 mt-1 text-monospace">
                                <ComponentesHTTP.StatusCode res={res} />
                                <ListGroupItem k={<ReactJson src={res.headers} collapsed name="cabeceras" iconStyle="square" displayDataTypes={false} />} />
                                <ListGroupItem k={<ReactJson src={res.body || res.error} collapsed={1} name={res.error ? 'error' : 'respuesta'} iconStyle="square" displayDataTypes={false} />} />
                            </ListGroup>
                        </ListGroup>
                    </Container>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default DetallesRespuestaHttp