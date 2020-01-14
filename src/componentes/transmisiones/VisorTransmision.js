import K from 'K';
import React, {useState, useCallback, useEffect} from 'react';
import { Container } from 'react-bootstrap';

import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi';
import fedicomFetch from 'util/fedicomFetch';

const VisorTransmision = (props) => {

    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
    let txId = props.match.params.txId;

    
    const ejecutarConsulta = useCallback( () => {
        setCargando(true);
        fedicomFetch(K.DESTINOS.MONITOR + '/query', { method: 'PUT' }, props.jwt, {filter:{_id: txId}})
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
    }, [txId, props.jwt, setResultado, setError, setCargando])

    useEffect(() => {
        ejecutarConsulta()
    }, [txId, props.jwt, ejecutarConsulta])

    return (
        <Container fluid>
            <h1>{txId}</h1>
            <DepuradorAPI id='VisorTransmisiones' query={{filter:{_id: txId}}} resultado={resultado} error={error} cargando={cargando} />
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