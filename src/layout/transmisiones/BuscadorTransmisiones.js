import K from 'K';
import React, { useState, useEffect, useCallback, useRef } from 'react';
//import moment from 'moment';
// import update from 'immutability-helper';
// import { Container, Row} from 'react-bootstrap';


import fedicomFetch from 'util/fedicomFetch';
import useStateLocalStorage from 'util/useStateLocalStorage';

// import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi';
import ControlesTabla from 'componentes/controlesTabla/ControlesTabla';

import EstadoConsulta from './EstadoConsulta';
import FilaTransmision from './FilaTransmision';
import FormularioOrden from './FormularioOrden';
import FormularioFiltros from './FormularioFiltros';

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

const LIMITE_POR_DEFECTO = 10;
const FILTRO_POR_DEFECTO = {
    type: { $in: [10, 14] },
    //createdAt: { $gte: moment().startOf('day'), $lt: moment().endOf('day') }
}
const SORT_POR_DEFECTO = { createdAt: -1 }


const BuscadorTransmisiones = (props) => {

    console.log('RENDER');
    // Control de la consulta al API
    const [query, _setQuery] = useStateLocalStorage('buscador.query', { filter: FILTRO_POR_DEFECTO, sort: SORT_POR_DEFECTO, limit: LIMITE_POR_DEFECTO, skip: 0 }, true)

    const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false })

    // Controla el formato en el que muestra el display (normal o compacto)
    const [formato, setFormato] = useStateLocalStorage('buscador.formato', 'normal', false)

    // Determina si mostrar la tabla de resultados, 
    const [funcion, setFuncion] = useStateLocalStorage('buscador.funcion', 'visor', false)

    // Para no perder el ultimo resultado entre cargas de mas resultados
    const ultimoResultado = useRef(resultado);
    if (resultado !== ultimoResultado.current) ultimoResultado.current = resultado;

    const construirQuery = useCallback(() => {
        return {
            filter: query.filter,
            proyection: PROYECCION,
            sort: query.sort,
            skip: parseInt(query.skip),
            limit: parseInt(query.limit)
        }
    }, [query])

    const ejecutarConsulta = useCallback(() => {
        setResultado({ datos: ultimoResultado.current.datos, error: ultimoResultado.current.error, cargando: true });
        fedicomFetch(K.DESTINOS.MONITOR + '/query', { method: 'PUT' }, props.jwt, construirQuery())
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
    }, [setResultado, props.jwt, construirQuery])

    useEffect(() => {
        ejecutarConsulta()
    }, [ejecutarConsulta])

    const cambiarLimiteResultados = (limite) => {
        let queryNueva = {}
        Object.assign(queryNueva, query);
        queryNueva.limit = limite;
        queryNueva.skip = 0;
        setFuncion('visor');
        _setQuery(queryNueva);
    };

    const cambiarPagina = (pagina) => {
        let queryNueva = {}
        Object.assign(queryNueva, query);
        queryNueva.skip = (pagina - 1) * query.limit;
        setFuncion('visor');
        _setQuery(queryNueva);
    };

    const cambiarOrden = (orden) => {
        let queryNueva = {}
        Object.assign(queryNueva, query);
        queryNueva.orden = orden;
        queryNueva.skip = 0;
        setFuncion('visor');
        _setQuery(queryNueva);
    }

    const cambiarFiltro = (filtro) => {
        let queryNueva = {}
        Object.assign(queryNueva, query);
        queryNueva.filter = filtro;
        queryNueva.skip = 0;
        setFuncion('visor');
        _setQuery(queryNueva);
    }




    let contenidoPagina = null;
    if (funcion === 'filtro') {

        contenidoPagina = <FormularioFiltros
            filtros={query.filter}
            onAceptar={cambiarFiltro}
            onCancelar={() => { setFuncion('visor') }}
        />

    } else if (funcion === 'orden') {

        contenidoPagina = <FormularioOrden
            orden={query.sort}
            onAceptar={cambiarOrden}
            onCancelar={() => { setFuncion('visor') }}
        />

    } else {

        let filas = [];
        if (!resultado.cargando && resultado.datos && resultado.datos.data && resultado.datos.data.length > 0) {
            resultado.datos.data.forEach((transmision, index) => {
                filas.push(<FilaTransmision key={index} transmision={transmision} formato={formato} />)
            });
        }
        contenidoPagina = (<>
            <ControlesTabla
                query={construirQuery()}
                resultado={resultado}
                formato={formato}
                funcion={funcion}
                onLimiteResultadosCambiado={cambiarLimiteResultados}
                onPaginaCambiada={cambiarPagina}
                onFormatoCambiado={setFormato}
                onFuncionCambiada={setFuncion} />
            {(resultado.cargando || !filas.length) && <EstadoConsulta query={construirQuery()} resultado={resultado} onRetry={ejecutarConsulta} />}
            {filas}
        </>);

    }

    return (
        <>
            <div className="container-xl">
                {contenidoPagina}
            </div>
            {/*<DepuradorAPI id='BuscadorTransmisiones' query={construirQuery()} resultado={resultado} />*/}
        </>
    )
}






export default BuscadorTransmisiones;