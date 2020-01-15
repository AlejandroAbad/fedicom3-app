import React from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { GoSync } from 'react-icons/go';



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



export default EstadoConsulta;