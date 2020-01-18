import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'
//import ReactJson from 'react-json-view';

import EtiquetaEstado from 'componentes/transmision/EtiquetaEstado';
import EtiquetaTipo from 'componentes/transmision/EtiquetaTipo';
import UsuarioTransmision from 'componentes/transmision/UsuarioTransmision';
import Fecha from 'componentes/transmision/Fecha';
import IpTransmision from 'componentes/transmision/IpTransmision';
import SoftwareEmisor from 'componentes/transmision/SoftwareEmisor';
import TipoPedido from 'componentes/transmision/TipoPedido';
import Flags from 'componentes/transmision/Flags';
import TotalesPedido from 'componentes/transmision/TotalesPedido';
import AlmacenServicio from 'componentes/transmision/AlmacenServicio';
import { CodigoCliente, TextoCodigoCliente } from 'componentes/transmision/CodigoCliente';
import { IoIosPerson } from 'react-icons/io';



const FilaTransmision = (props) => {

    let { transmision: tx, formato } = props

    if (formato === 'compacto') {
        let user = new CodigoCliente(tx.client);
        if (user.isVacio())
            user = new CodigoCliente(tx.authenticatingUser);
        
        let componenteCliente = <TextoCodigoCliente codigo={user} />
        

        return (
            <Row className="border-bottom d-flex no-gutters justify-content-start align-items-start pb-2 pt-2 ">
                <Col xs={12} sm={6} md={3} lg={2} xl="auto" className="ml-xl-3"><Fecha fecha={tx.createdAt} formato="corto"/></Col>
                <Col xs={12} sm={6} md={4} lg={3} xl="auto" className="ml-xl-3"><Link to={'/transmisiones/' + tx._id}><code className="text-uppercase">{tx._id}</code></Link></Col>
                <Col xs={6} sm={6} md={5} lg={2} xl="auto" className="ml-xl-3"><EtiquetaTipo tipo={tx.type} /></Col>
                <Col xs={6} sm={6} md={3} lg={2} xl="auto" className="ml-xl-3"><EtiquetaEstado estado={tx.status} /></Col>
                <Col xs={6} sm={6} md={3} lg={3} xl="auto" className="ml-xl-3"><IoIosPerson className="text-info" size={18} />{componenteCliente}</Col>
                <Col xs={6} sm={6} md={3} lg={2} xl="auto" className="ml-xl-3"><AlmacenServicio transmision={tx} formato="corto" /></Col>
                <Col xs={12} sm={12} md={3} lg={10} xl="auto" className="ml-xl-3"><TotalesPedido transmision={tx} /></Col>
                <Col xl="auto" className="d-none d-xl-inline-block ml-xl-3"><Flags flags={tx.flags} formato="corto" /></Col>
            </Row>
        )
    }


    return (
        <Row className="border-bottom pl-3 pl-sm-0 pb-2 pt-2 no-gutters">
            <Col lg={3} md={4} sm={6}>
                <Row className="p-0 m-0 no-gutters">
                    <Col lg={12}><Fecha fecha={tx.createdAt} /></Col>
                    <Col lg={12}><code className="text-monospace text-info">TID</code> <Link to={'/transmisiones/' + tx._id}><code className="text-uppercase">{tx._id}</code></Link></Col>
                    {tx.crc && <Col lg={12}><code className="text-monospace text-info">CRC</code> <code className="text-uppercase text-dark">{tx.crc}</code></Col>}
                </Row>
            </Col>
            <Col lg={2} md={4} sm={6}>
                <Row className="p-0 m-0 no-gutters text-md-center">
                    <Col lg={12}><EtiquetaTipo tipo={tx.type} /></Col>
                    <Col lg={12}><EtiquetaEstado estado={tx.status} /></Col>
                </Row>
            </Col>
            <Col lg={3} md={4} sm={6}>
                <Row className="p-0 m-0 no-gutters">
                    <Col lg={12}><UsuarioTransmision transmision={tx} /></Col>
                    <Col lg={12}><TipoPedido transmision={tx} /></Col>
                </Row>
            </Col>
            <Col lg={2} md={4} sm={6}>
                <Row className="p-0 m-0 no-gutters">
                    <Col lg={12} ><IpTransmision ip={(tx.clientRequest && tx.clientRequest.ip) || null} /></Col>
                    <Col lg={12}><SoftwareEmisor softwareId={(tx.clientRequest && tx.clientRequest.headers['software-id']) || null} /></Col>
                    <Col lg={12}><AlmacenServicio transmision={tx} /></Col>
                </Row>
            </Col>
            <Col lg={2} md={8} sm={12}>
                <Row className="p-0 m-0 no-gutters">
                    <Col lg={12} md={6} sm={6} className="text-md-center" ><TotalesPedido transmision={tx} /></Col>
                    <Col lg={12} md={6} sm={6} className="text-lg-center"><Flags flags={tx.flags} /></Col>
                </Row>
            </Col>

            {/*<Col lg={12} className="mt-3 border-top pt-4">
                <ReactJson src={tx || {}} collapsed />
            </Col>*/}
        </Row>
    )
}


export default FilaTransmision;