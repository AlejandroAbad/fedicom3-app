import React from 'react'
import { FiPackage, FiThumbsDown, FiThumbsUp } from 'react-icons/fi'

import Icono from 'componentes/icono/Icono'

const Totales = ({ transmision, ...props }) => {

    let t = (transmision && transmision.flags) ? transmision.flags.s : null;

    if (!t) return null;

    let cantidad = null;
    if (t.cantidadBonificacion) {
        cantidad = (
            <>
                <Icono icono={FiThumbsUp} className="text-success ml-3 mr-1" posicion={[16, 0]} />{t.cantidad}+{t.cantidadBonificacion}
            </>
        )
    } else {
        cantidad = (
            <>
                <Icono icono={FiThumbsUp} className="text-success ml-3 mr-1" posicion={[16, 0]} />{t.cantidad}
            </>
        )
    }

    let faltas = null;
    if (t.cantidadFalta || t.cantidadBonificacionFalta)
        if (t.cantidadBonificacionFalta) {
            faltas = (
                <span className="text-danger">
                    <Icono icono={FiThumbsDown} className="text-danger ml-2 mr-1" posicion={[16, 0]} />{t.cantidadFalta}+{t.cantidadBonificacionFalta}
                </span>
            )
        } else {
            faltas = (
                <span className="text-danger">
                    <Icono icono={FiThumbsDown} className="text-danger ml-2 mr-1" posicion={[16, 0]} />{t.cantidadFalta}
                </span>
            )
        }


    return (
        <code className="text-reset">
            <Icono icono={FiPackage} className="text-info mr-1" posicion={[16, 0]} />{t.lineas}{cantidad}{faltas}
        </code>
    )
}

export default Totales;