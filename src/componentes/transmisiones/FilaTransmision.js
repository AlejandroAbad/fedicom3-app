import React from 'react';
import {Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import ReactJson from 'react-json-view';

import EtiquetaEstado from 'componentes/camposTransmision/EtiquetaEstado';
import EtiquetaTipo from 'componentes/camposTransmision/EtiquetaTipo';
import UsuarioTransmision from 'componentes/camposTransmision/UsuarioTransmision';
import Fecha from 'componentes/camposTransmision/Fecha';
import IpTransmision from 'componentes/camposTransmision/IpTransmision';
import SoftwareEmisor from 'componentes/camposTransmision/SoftwareEmisor';
import Flags from 'componentes/camposTransmision/Flags';



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
            <Col lg={2} md={4}>
                <Row className="p-0 m-0 no-gutters">
                    <Col lg={12}><EtiquetaTipo tipo={tx.type} /></Col>
                    <Col lg={12}><EtiquetaEstado estado={tx.status} /></Col>
                </Row>
            </Col>
            <Col lg={3} md={4}><UsuarioTransmision transmision={tx} /></Col>
            <Col lg={2} md={12}>
                <Row className="p-0 m-0 no-gutters">
                    <Col lg={12}><IpTransmision ip={(tx.clientRequest && tx.clientRequest.ip) || null} /></Col>
                    <Col lg={12}><SoftwareEmisor softwareId={(tx.clientRequest && tx.clientRequest.headers['software-id']) || null} /></Col>
                </Row>
            </Col>
            <Col lg={2} md={12} className="text-center">
                <Flags flags={tx.flags} />
            </Col>

            {<Col lg={12} className="mt-3 border-top pt-4">
                <ReactJson src={tx || {}} collapsed />
            </Col>}
        </Row>
        
    )
}


export default FilaTransmision;