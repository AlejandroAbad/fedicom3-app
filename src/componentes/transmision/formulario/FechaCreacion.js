import React from 'react'
import RangoFechas from './RangoFechas'


const FechaCreacion = ({...props}) => {

    return (
        <RangoFechas {...props} 
            nombre="createdAt" 
            rutaFiltro="createdAt" 
            titulo="Fecha de recepción" />
    )

}

export default FechaCreacion