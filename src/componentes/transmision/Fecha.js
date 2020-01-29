import React from 'react'
import { MdAccessTime } from 'react-icons/md'

import Icono from 'componentes/icono/Icono'

const dateToHuman = (date) => {
    date = new Date(date)

    return date.getDate().toString().padStart(2, '0') + '/' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
        date.getFullYear() + ' ' +
        date.toLocaleTimeString('es-ES').padStart(8, '0')

}


const dateToHumanCorto = (date) => {
    date = new Date(date)

    return date.getDate().toString().padStart(2, '0') + '/' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
        (date.getFullYear() % 1000) + ' ' +
        date.toLocaleTimeString('es-ES').padStart(8, '0')

}


const dateToHumanLargo = (date) => {
    date = new Date(date)

    return <>
        {dateToHuman(date)}<span className="text-muted">.{date.getMilliseconds()}</span>
    </>
        

}

const Fecha = ({ fecha, formato, ...props }) => {

    if (!fecha) return <span className="text-muted">N/A</span>

    let cadena = ''
    let icono = null

    if (formato === 'corto') {
        cadena = dateToHumanCorto(fecha)
    } else if (formato === 'largo') {
        cadena = dateToHumanLargo(fecha)
    } else {
        cadena = dateToHuman(fecha);
        icono = <Icono icono={MdAccessTime} posicion={[16, 0]} className="text-info mr-1" />
    }

    return (
        <span className="text-monospace">
            {icono}{cadena}
        </span>
    )
}

export default Fecha