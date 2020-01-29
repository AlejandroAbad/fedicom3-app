import React from 'react'
import { Row, Col } from 'react-bootstrap'

import DetallesPeticionHttp from './DetallesPeticionHttp'
import DetallesRespuestaHttp from './DetallesRespuestaHttp'




const DetallesSap = ({ transmision }) => {
    let tx = transmision
    if (!tx || (!tx.sapRequest && !tx.sapResponse)) return null    

    return (
        <div className="mt-5 container-xl">
            <h4 className="border-bottom pb-1">
                Comunicación SAP<br/>
                <small className="text-muted"><small>Detalle de lo que se ha transmitido entre SAP y el concentrador</small></small>
            </h4>
            <Row>
                <Col lg={6}>
                    <DetallesPeticionHttp req={tx.sapRequest} />
                </Col>
                <Col lg={6}>
                    <DetallesRespuestaHttp res={tx.sapResponse} />
                </Col>
            </Row>
        </div>
    )

}

export default DetallesSap