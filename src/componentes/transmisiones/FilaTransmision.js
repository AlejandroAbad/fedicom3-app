import React from 'react';
import {Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom'


import EtiquetaEstado from 'componentes/fedicom/EtiquetaEstado';
import EtiquetaTipo from 'componentes/fedicom/EtiquetaTipo';
import UsuarioTransmision from 'componentes/fedicom/UsuarioTransmision';
import Fecha from 'componentes/fedicom/Fecha';

const FilaTransmision = (props) => {

    let tx = props.transmision;

    return (
        <Row className="border-bottom pb-4 pt-2 mb-3 d-flex align-items-center no-gutters">
            <Col className="border-right" lg={3} md={4}>
                <small className="font-weight-bold">ID</small> <Link to={'/transmisiones/' + tx._id}><code className="text-uppercase">{tx._id}</code></Link><br />
                <Fecha fecha={tx.createdAt} />
            </Col>
            <Col className="border-right" lg={2} md={3}><EtiquetaTipo tipo={tx.type} /><br /><EtiquetaEstado estado={tx.status} /></Col>
            <Col className="border-right" lg={3} md={5}><UsuarioTransmision transmision={tx} /></Col>
            <Col className="border-right" lg={4} md={12}>Resto</Col>
        </Row>
        
    )
}


export default FilaTransmision;