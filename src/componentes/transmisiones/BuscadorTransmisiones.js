import K from 'K';
import React, { useState, useEffect, useCallback } from 'react';
// import { Container, Row} from 'react-bootstrap';


import fedicomFetch from 'util/fedicomFetch';
import useStateLocalStorage from 'util/useStateLocalStorage';

import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi';
import EstadoConsulta from './EstadoConsulta';
import FilaTransmision from './FilaTransmision';
import MenuBusqueda from './MenuBusqueda';

const PROYECCION = {
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
    "clientRequest.body.tipoPedido": 1,
    "clientRequest.body.codigoAlmacenServicio": 1,
    "clientResponse.body.codigoAlmacenServicio": 1,
    flags: 1,
    crc: 1,                 // SOLO PEDIDOS (10)
    pedidoConsultado: 1,    // SOLO CONSULTAS DE PEDIDO (11)
    originalTx: 1,          // SOLO EN DUPLICADOS (12) / RETRANSMISIONES (14)
    confirmingId: 1         // SOLO CONFIRMACIONES (13)
};


const BuscadorTransmisiones = (props) => {

    let limit = 20;
    let filter = { type: { $in: [10, 14] } };


    let sort = { createdAt: -1 }


    // Control de la consulta al API
    const [query, setQuery] = useStateLocalStorage('buscador.consulta', { filter, limit, PROYECCION, sort }, true);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const ejecutarConsulta = useCallback(() => {
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
            
            <div className="container-xl">
                <MenuBusqueda />
                {!filas.length && <EstadoConsulta query={query} resultado={resultado} error={error} cargando={cargando} onRetry={ejecutarConsulta} />}
                {filas}
            </div>
            <DepuradorAPI id='BuscadorTransmisiones' query={query} resultado={resultado} error={error} cargando={cargando} onQueryChanged={setQuery} />
        </>
    )
}






export default BuscadorTransmisiones;