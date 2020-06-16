import React from 'react'
import RangoFechas from './RangoFechas'
import { EJSON } from 'bson'
import moment from 'moment';


const FechaCreacion = ({...props}) => {

    return (
        <RangoFechas {...props} 
            rutaFiltro="@createdAt" 
            titulo="Fecha de recepción" />
    )

}


FechaCreacion.expandirOpciones = (filtro) => {
    if (!filtro) return

    let fechas = filtro['@createdAt'];
    if (!fechas) return;

    let filtroApi = {}

    if (fechas.$gte) {
        filtroApi.$gte = fechas.$gte
    } else {
        filtroApi.$gte = moment().startOf('day').toDate()
    }

    if (fechas.$lte) {
        filtroApi.$lte = fechas.$lte
    } else {
        filtroApi.$lte = moment().endOf('day').toDate()
    }


    console.log(filtroApi)
    console.log(EJSON.serialize(filtroApi))


    filtro.createdAt = EJSON.serialize(filtroApi);

}


export default FechaCreacion