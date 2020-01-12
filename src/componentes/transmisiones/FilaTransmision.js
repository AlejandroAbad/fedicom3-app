import React from 'react';
import {Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import ReactJson from 'react-json-view';

import EtiquetaEstado from 'componentes/fedicom/EtiquetaEstado';
import EtiquetaTipo from 'componentes/fedicom/EtiquetaTipo';
import UsuarioTransmision from 'componentes/fedicom/UsuarioTransmision';
import Fecha from 'componentes/fedicom/Fecha';

const FilaTransmision = (props) => {

    let tx = props.transmision;

    return (
        <Row className="border-bottom pb-4 pt-2 mb-3 no-gutters">
            <Col lg={3} md={4}>
                <Row className="p-0 m-0 no-gutters">
                    <Col lg={12}><Fecha fecha={tx.createdAt} /></Col>
                    <Col lg={12}><code className="text-monospace text-info">TID</code> <Link to={'/transmisiones/' + tx._id}><code className="text-uppercase">{tx._id}</code></Link></Col>
                    { tx.crc && <Col lg={12}><code className="text-monospace text-info">CRC</code> <code className="text-uppercase text-dark">{tx.crc}</code></Col>}
                </Row>
            </Col>
            <Col lg={2} md={3}>
                <Row className="p-0 m-0 no-gutters">
                    <Col lg={12}><EtiquetaTipo tipo={tx.type} /></Col>
                    <Col lg={12}><EtiquetaEstado estado={tx.status} /></Col>
                </Row>
            </Col>
            <Col lg={3} md={5}><UsuarioTransmision transmision={tx} /></Col>
            <Col lg={4} md={12}>Resto</Col>

            {/*<Col lg={12}>
            <ReactJson src={tx || {}} collapsed />
    </Col>*/}
        </Row>
        
    )
}


export default FilaTransmision;