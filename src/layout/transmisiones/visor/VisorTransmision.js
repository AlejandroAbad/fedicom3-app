import K from 'K'
import React, { useState, useCallback, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'


import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi'
import fedicomFetch from 'util/fedicomFetch'

import EtiquetaTipo from 'componentes/transmision/EtiquetaTipo'
import EtiquetaEstado from 'componentes/transmision/EtiquetaEstado'
import Fecha from 'componentes/transmision/Fecha'
import {UsuarioTransmision} from 'componentes/transmision/CodigoCliente'

import DetallesPedido from './DetallesPedido'

const VisorTransmision = (props) => {

    const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false });
    let txId = props.match.params.txId;

    const ejecutarConsulta = useCallback(() => {
        setResultado({ datos: null, error: null, cargando: false })
        fedicomFetch(K.DESTINOS.MONITOR + '/query', { method: 'PUT' }, props.jwt, { filter: { _id: txId } })
            .then(response => {
                if (response) {
                    if (response.ok) {
                        setResultado({ datos: response.body, error: null, cargando: false });
                    } else {
                        setResultado({ datos: null, error: response.body, cargando: false });
                    }
                }
            })
            .catch(err => {
                setResultado({ datos: null, error: err, cargando: false });
            })
    }, [setResultado, props.jwt, txId])

    useEffect(() => {
        ejecutarConsulta()
    }, [ejecutarConsulta, props.jwt, txId])


    if (resultado?.datos?.data?.length > 0) {
        let tx = resultado.datos.data[0]
        return (
            <>
                <div className="container-xl">
                    <Row>
                        <Col xs={12} className="text-monospace text-right"><strong>ID transmisión: </strong>{tx._id}</Col>
                    </Row>
                    <Row className="mt-1">
                        <Col md={4} sm={6}>
                            <Row>
                                <Col xs={12}><Fecha fecha={tx.createdAt} /></Col>
                            </Row>
                        </Col>
                        <Col md={4} sm={6}>
                            <Row>
                                <Col xs={12}><EtiquetaTipo tipo={tx.type} /></Col>
                                <Col xs={12}><EtiquetaEstado estado={tx.status} /></Col>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <Row>
                                <Col xs={12}><UsuarioTransmision transmision={tx} /></Col>
                            </Row>
                        </Col>
                    </Row>
                    
                    <DetallesPedido transmision={tx} />


                </div>
                <Container fluid className="mt-5 pt-5">
                    <DepuradorAPI id='VisorTransmisiones' query={{ filter: { _id: txId } }} resultado={resultado} />)
                </Container>
            </>
        )
    } else {
        return (

            <Container fluid>
                Cargando ...
                <DepuradorAPI id='VisorTransmisiones' query={{ filter: { _id: txId } }} resultado={resultado} />)
            </Container>
        )
    }

}

/*
INFORMACION TECNICA:
    - txId
    - iid
    - tx version
    - flags

INFORMACION DE TRANSMISION
    + tipo
    + estado
    + fecha de inicio 
    - fecha de fin
    - ip
    - software ID
    - autenticacion


INFORMACION DE PEDIDO
    + numero pedido origen
    + numero pedido fedicom / CRC
    + numeros pedido sap / agrupado
    + codigo de cliente
    + codigo cliente SAP
    - punto de entrega
    + tipo de pedido
    + almacen de servicio
    + BAPI - tipo pedido
    + BAPI - motivo pedido
    - incidencias
    - direccion envio
    - aplazamiento
    - lineas:
        - orden
        - codigo articulo
        - codigo articulo sustituyente
        - nombre articulo
        - cantidad pedida + bonificada
        - cantidad servida + bonificada ??
        - cantidad falta + bonificada
        - almacen
        - estupefaciente
        - incidencias
        - serviciodemorado

    - confirmaciones del pedido
        - id
        - hora
        - sistema sap

    - duplicados del pedido
        - id
        - hora

    - retransmisiones del pedido
        - id
        - hora
        - estado
        - opciones
        - mensaje de error (si no se pudo retransmitir)
        - newValues vs oldValues



INFORMACION HTTP CON EL CLIENTE

INFORMACION HTTP CON SAP

BENCHMARKING





*/



export default VisorTransmision;