import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import DetallesPeticionHttp from './DetallesPeticionHttp'
import DetallesRespuestaHttp from './DetallesRespuestaHttp'




const DetallesHttp = ({ transmision }) => {
    let tx = transmision
    if (!tx) return null    

    return (
        <Container fluid className="mt-5 px-lg-5">
            <h4 className="border-bottom pb-1">
                Comunicación HTTP<br/>
                <small className="text-muted"><small>Detalle de lo que se ha transmitido entre el cliente de farmacia y el concentrador</small></small>
            </h4>
            <Row>
                <Col lg={6}>
                    <DetallesPeticionHttp req={tx.clientRequest} />
                </Col>
                <Col lg={6}>
                    <DetallesRespuestaHttp res={tx.clientResponse} />
                </Col>
            </Row>
        </Container>
    )

}

export default DetallesHttp