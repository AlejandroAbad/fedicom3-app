import React from 'react'
import { FaListAlt } from 'react-icons/fa'

import Icono from 'componentes/icono/Icono'

const Totales = ({ transmision, ...props }) => {

    let t = (transmision && transmision.flags) ? transmision.flags.s : null;

    if (!t) return null;

    let cantidad = null;
    if (t.cantidadBonificacion) {
        cantidad = (
            <>
                {t.cantidad}+{t.cantidadBonificacion}
            </>
        )
    } else {
        cantidad = (
            <>
                {t.cantidad}
            </>
        )
    }

    let faltas = null;
    if (t.cantidadFalta || t.cantidadBonificacionFalta)
        if (t.cantidadBonificacionFalta) {
            faltas = (
                <>
                    {'/'}<span className="text-danger">{t.cantidadFalta}+{t.cantidadBonificacionFalta}</span>
                </>
            )
        } else {
            faltas = (
                <>
                    {'/'}<span className="text-danger">{t.cantidadFalta}</span>
                </>
            )
        }


    return (
        <code className="text-reset">
            <Icono icono={FaListAlt} className="text-info mr-1" posicion={[18, 2]} />{t.lineas} ({cantidad}{faltas})
        </code>
    )
}

export default Totales;