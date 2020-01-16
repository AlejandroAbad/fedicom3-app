import K from 'K';
import React, {useState, useCallback, useEffect} from 'react';
import { Container } from 'react-bootstrap';

import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi';
import fedicomFetch from 'util/fedicomFetch';

const VisorTransmision = (props) => {

    const [resultado, setResultado] = useState( {datos: null, error: null, cargando: false} );
    let txId = props.match.params.txId;

    const ejecutarConsulta = useCallback( () => {
        setResultado({ datos: null, error: null, cargando: false })
        fedicomFetch(K.DESTINOS.MONITOR + '/query', { method: 'PUT' }, props.jwt, {filter:{_id: txId}})
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

    return (
        <Container fluid>
            <h1>{txId}</h1>
            <DepuradorAPI id='VisorTransmisiones' query={{filter:{_id: txId}}} resultado={resultado} />
        </Container>
        




    )
}

/*
INFORMACION TECNICA:
    - txId
    - iid
    - tx version
    - flags

INFORMACION DE TRANSMISION
    - tipo
    - estado
    - fecha de inicio 
    - fecha de fin
    - ip
    - software ID
    - autenticacion


INFORMACION DE PEDIDO
    - numero pedido origen
    - numero pedido fedicom / CRC
    - numeros pedido sap / agrupado
    - codigo de cliente
    - codigo cliente SAP
    - punto de entrega
    - tipo de pedido
    - almacen de servicio
    - BAPI - tipo pedido
    - BAPI - motivo pedido
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