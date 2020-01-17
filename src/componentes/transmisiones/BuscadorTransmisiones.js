import K from 'K';
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import update from 'immutability-helper';
// import { Container, Row} from 'react-bootstrap';


import fedicomFetch from 'util/fedicomFetch';
import useStateLocalStorage from 'util/useStateLocalStorage';

// import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi';
import EstadoConsulta from './EstadoConsulta';
import FilaTransmision from './FilaTransmision';
import MenuBusqueda from './MenuBusqueda';

const PROYECCION_POR_DEFECTO = {
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

const LIMITE_POR_DEFECTO = 10;
const FILTRO_POR_DEFECTO = { type: { $in: [10, 14] } }
const SORT_POR_DEFECTO = { createdAt: -1 }


const BuscadorTransmisiones = (props) => {

    // Control de la consulta al API
    const [query, setQuery] = useStateLocalStorage('buscador.consulta', { filter: FILTRO_POR_DEFECTO, limit: LIMITE_POR_DEFECTO, proyeccion: PROYECCION_POR_DEFECTO, sort: SORT_POR_DEFECTO, skip: 0 }, true);
    const [resultado, setResultado] = useState({datos: null, error: null, cargando: false});
    const [formato, setFormato] = useStateLocalStorage('buscador.formato', 'normal', false);

    // Para no perder el ultimo resultado entre cargas de mas resultados
    const ultimoResultado = useRef( resultado );
    if (resultado !== ultimoResultado.current) ultimoResultado.current = resultado;
        

    const ejecutarConsulta = useCallback(() => {
        setResultado({ datos: ultimoResultado.current.datos, error: ultimoResultado.current.error, cargando: true });
        fedicomFetch(K.DESTINOS.MONITOR + '/query', { method: 'PUT' }, props.jwt, query)
            .then(response => {
                if (response) {
                    if (response.ok) {
                        setResultado({ datos: response.body, error: null, cargando: false });
                    } else {
                        setResultado({ datos: null, error: response.body, cargando: false });
                    }
                }

            })
            .catch(error => {
                setResultado({ datos: null, error, cargando: false });
            })
    }, [query, setResultado, props.jwt])

    useEffect(() => {
        ejecutarConsulta()
    }, [ejecutarConsulta, query, props.jwt])


    const cambiarLimite = (newLimit) => {
        let queryNueva = {}
        Object.assign(queryNueva, query);
        queryNueva.limit = newLimit;
        setQuery(queryNueva);
    };

    const cambiarPagina = (newPage) => {
        let queryNueva = {}
        Object.assign(queryNueva, query);
        queryNueva.skip = (newPage - 1) * query.limit;
        setQuery(queryNueva);
    };

    



    let filas = [];
    if (!resultado.cargando && resultado.datos && resultado.datos.data && resultado.datos.data.length > 0) {
        resultado.datos.data.forEach((transmision, index) => {
            filas.push(<FilaTransmision key={index} transmision={transmision} formato={formato} />)
        });
    }

    return (
        <>
            <div className="container-xl">
                <MenuBusqueda 
                    query={query} 
                    resultado={resultado}
                    formato={formato}
                    onLimiteCambiado={cambiarLimite} 
                    onPaginaCambiada={cambiarPagina} 
                    onFormatoCambiado={setFormato}/>
                
                {(resultado.cargando || !filas.length)  && <EstadoConsulta query={query} resultado={resultado} onRetry={ejecutarConsulta} />}
                {filas}
            </div>
            {/*<DepuradorAPI id='BuscadorTransmisiones' query={query} resultado={resultado} onQueryChanged={setQuery} />*/}
        </>
    )
}






export default BuscadorTransmisiones;