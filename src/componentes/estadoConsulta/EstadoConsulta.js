import React from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { GoSync } from 'react-icons/go';



const EstadoConsulta = ({resultado, onRetry}) => {

    const { datos, error, cargando } = resultado;

    if (cargando) {
        return (
            <Alert variant='primary' className="text-center mt-3">
                <Spinner animation="border" variant="primary" className="mt-2" />
                <h5 className="pt-2">Cargando datos ...</h5>
            </Alert>
        )
    }



    if (!error || error.length === 0) {
        if (datos?.resultados?.length === 0 || datos?.length === 0) {
            return (

                <Alert variant='warning' className="mt-3">
                    <Button variant='dark' onClick={onRetry} className="float-right" size="sm">
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
    if (error.forEach) {
        error.forEach((err, index) => {
            if (err.codigo && err.descripcion) {
                alertas.push(<li key={index}>{err.descripcion} <small className="text-muted">{err.codigo}</small></li>);
            } else {
                alertas.push(<li key={index}>No se pudo alcanzar el servidor</li>);
            }
        })
    } else {
        alertas.push(<li key={0}>No se pudo alcanzar el servidor</li>);
    }

    return (
        <Alert variant='danger'>
            <Button variant='dark' onClick={onRetry} className="float-right" size="sm">
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