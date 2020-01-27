import React from 'react'

import ListGroupItem from './ListGroupItem'
import { Accordion, Card, Container, ListGroup } from 'react-bootstrap'
import ReactJson from 'react-json-view'
import ComponentesHTTP from 'componentes/http/ComponentesHTTP'



const DetallesPeticionHttp = ({ req }) => {
    if (!req) return null
    
    return (
        <Accordion defaultActiveKey="0" className="my-3">
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
                    Petición
                </Accordion.Toggle>

                <Accordion.Collapse eventKey="0">
                    <Container fluid>
                        <ListGroup variant="flush" className="border-bottom border-lg-bottom-0 mt-1 text-monospace">
                            <ComponentesHTTP.Ip req={req} />
                            <ComponentesHTTP.Metodo req={req} />
                            <ComponentesHTTP.Url req={req} />
                            <ComponentesHTTP.Ruta req={req} />
                            <ComponentesHTTP.SoftwareId req={req} />
                            <ListGroupItem k={<ReactJson src={req.headers} collapsed name="cabeceras" iconStyle="square" displayDataTypes={false} />} />
                            <ListGroupItem k={<ReactJson src={req.body} collapsed={1} name="petición" iconStyle="square" displayDataTypes={false} />} />
                        </ListGroup>
                    </Container>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default DetallesPeticionHttp