import K from 'K';
import React, { useState, useEffect, useCallback } from 'react';
import ReactJson from 'react-json-view';
import { Button, Collapse, Col, Row, Container, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { GoSync } from 'react-icons/go'


import fedicomFetch from 'util/fedicomFetch';
import useStateLocalStorage from 'util/useStateLocalStorage';


import FilaTransmision from 'componentes/transmisiones/FilaTransmision';


const BuscadorTransmisiones = (props) => {

    let limit = 20;
    let filter = { type: { $in: [10, 11, 12, 13, 14] } };
    let projection = {
        _id: 1,
        client: 1,
        authenticatingUser: 1,
        "clientRequest.ip": 1,
        "sapResponse.body.sap_cliente": 1,
        type: 1,
        status: 1,
        createdAt: 1,
        numerosPedidoSAP: 1,
        numeroPedidoAgrupado: 1,
        "clientRequest.headers.software-id": 1,
        crc: 1,                 // SOLO PEDIDOS (10)
        pedidoConsultado: 1,    // SOLO CONSULTAS DE PEDIDO (11)
        originalTx: 1,          // SOLO EN DUPLICADOS (12) / RETRANSMISIONES (14)
        confirmingId: 1         // SOLO CONFIRMACIONES (13)
    };


    let sort = { createdAt: -1 }


    const [query, setQuery] = useStateLocalStorage('buscador.consulta', { filter, limit, projection, sort }, true);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const ejecutarConsulta = useCallback( () => {
        setCargando(true);
        fedicomFetch(K.DESTINOS.MONITOR + '/query', { method: 'PUT' }, props.jwt, query)
            .then(response => {
                if (response) {
                    if (response.ok) {
                        setResultado(response.body);
                        setError(null);
                    } else {
                        setResultado(null);
                        setError(response.body);
                    }
                }

            })
            .catch(error => {
                setResultado(null);
                setError(error);
            })
            .finally(() => setCargando(false))
    }, [query, props.jwt, setResultado, setError, setCargando])

    useEffect(() => {
        ejecutarConsulta()
    }, [ejecutarConsulta, query, props.jwt])

    let filas = [];
    if (resultado && resultado.data && resultado.data.length > 0) {
        resultado.data.forEach((transmision, index) => {
            filas.push(<FilaTransmision key={index} transmision={transmision} />)
        });
    }

    return (
        <>
            <EstadoConsulta query={query} resultado={resultado} error={error} cargando={cargando} onRetry={ejecutarConsulta} />
            <Container>
                {filas}
            </Container>
            <DepuradorAPI query={query} resultado={resultado} error={error} cargando={cargando} onQueryChanged={setQuery} />
        </>
    )
}

const EstadoConsulta = (props) => {
    if (props.cargando) {
        return (
            <Alert variant='primary' className="text-center">
                <Spinner animation="border" variant="primary" className="mt-2" />
                <h5 className="pt-2">Cargando datos ...</h5>
            </Alert>
        )
    }



    if (!props.error || props.error.length === 0) {
        if (props.resultado && props.resultado.data && props.resultado.data.length === 0) {
            return (
                
                <Alert variant='warning'>
                    <Button variant='dark' onClick={props.onRetry} className="float-right" size="sm">
                        <GoSync size={18} style={{ paddingBottom: '3px' }} /> Reintentar
                    </Button>
                    <Alert.Heading className="mt-1">Sin resultados</Alert.Heading>
                    Pruebe a cambiar los filtros de búsqueda
                </Alert>
            )
        }
        return null;
    }

    let alertas = [];
    if (props.error.forEach) {
        props.error.forEach((error, index) => {
            if (error.codigo && error.descripcion) {
                alertas.push(<li key={index}>{error.descripcion} <small className="text-muted">{error.codigo}</small></li>);
            } else {
                alertas.push(<li key={index}>No se pudo alcanzar el servidor</li>);
            }
        })
    } else {
        alertas.push(<li key={0}>No se pudo alcanzar el servidor</li>);
    }

    return (
        <Alert variant='danger'>
            <Button variant='dark' onClick={props.onRetry} className="float-right" size="sm">
                <GoSync size={18} style={{ paddingBottom: '3px' }} /> Reintentar
            </Button>

            <Alert.Heading>Error al obtener datos</Alert.Heading>
            <ul>
                {alertas}
            </ul>

        </Alert>
    )
}


const DepuradorAPI = (props) => {
    const [openDebug, setOpenDebug] = useStateLocalStorage('buscador.debugApi', false, false);

    var callbackBinds = {};
    if (props.onQueryChanged) {
        callbackBinds = {
            onEdit: (e) => props.onQueryChanged(e.updated_src),
            onAdd: (e) => props.onQueryChanged(e.updated_src),
            onDelete: (e) => props.onQueryChanged(e.updated_src),
            shouldCollapse: (key) => { return ['filter','projection','sort'].includes(key.name) }
        }
    }

    let estado = null;
    if (props.cargando)
        estado = <ProgressBar animated now={100} label={`Cargando ...`} className="my-3" />;
    else
        if (props.error) estado = <ProgressBar now={100} variant="danger" label={`ERROR`} className="my-3" />;
        else estado = <ProgressBar now={100} variant="success" label={`OK`} className="my-3" />;


    return (
        <Container fluid className="border border-info rounded pb-0 mb-3 mt-5">
            <Col className="text-right my-4">
                <Button size="sm" onClick={() => setOpenDebug(!openDebug)} aria-controls="collapse-depurador-api" aria-expanded={openDebug}>
                    {openDebug ? 'Ocultar debug' : 'Mostrar debug'}
                </Button>
            </Col>

            <Collapse in={openDebug}>
                <Container fluid id="example-collapse-text" className="mt-4 mb-5">
                    <Row>
                        <Col lg={4}>
                            <h3>Consulta</h3>
                            <ReactJson src={props.query || {}} {...callbackBinds} />
                        </Col>
                        <Col lg={8}>
                            <h3>Respuesta</h3>
                            {estado}
                            {!props.cargando && <ReactJson src={props.resultado || props.error || {}} shouldCollapse={(key)=> { return key.name === 'data' }}/>}
                        </Col>
                    </Row>
                </Container>
            </Collapse>
        </Container>

    )
}




export default BuscadorTransmisiones;