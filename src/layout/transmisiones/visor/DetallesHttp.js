import React from 'react'
import {  Row, Col } from 'react-bootstrap'

import DetallesPeticionHttp from './DetallesPeticionHttp'
import DetallesRespuestaHttp from './DetallesRespuestaHttp'




const DetallesHttp = ({ transmision }) => {
    let tx = transmision
    if (!tx) return null    

    return (
        <div className="mt-5 container-xl">
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
        </div>
    )

}

export default DetallesHttp