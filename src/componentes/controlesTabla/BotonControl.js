import React from 'react'
import Icono from 'componentes/icono/Icono'

const BotonControl = ({ className, deshabilitado, activo, onClick, icono, numero, ...props }) => {

    let classNameLi = (className || '') + ' BotonControl page-item ' + (deshabilitado ? 'disabled' : '') + (activo ? 'active' : '')
    let classNameSpan = 'EnlaceControl page-link ' + (deshabilitado || activo ? '' : 'enlace')

    let callback = () => {
        if (!deshabilitado && !activo && onClick) {
            onClick()
        }
    }

    let contenido = null
    if (icono) {
        contenido = <Icono icono={icono} posicion={[22, 2]} />
    }
    else if (numero) contenido = numero

    return (
        <li className={classNameLi} {...props}>
            <span className={classNameSpan} role="button" onClick={callback}>
                {contenido}
            </span>
        </li>
    )
}

export default BotonControl