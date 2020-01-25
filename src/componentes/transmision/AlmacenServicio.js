import K from 'K'
import React from 'react'

import { FaWarehouse } from 'react-icons/fa'
import Icono from 'componentes/icono/Icono'


const AlmacenServicio = ({ transmision, formato, ...props }) => {

    let almacenSolicitado = (transmision && transmision.clientRequest && transmision.clientRequest.body) ? transmision.clientRequest.body.codigoAlmacenServicio : null
    let almacenElegido = (transmision && transmision.clientResponse && transmision.clientResponse.body) ? transmision.clientResponse.body.codigoAlmacenServicio : null

    if (!almacenElegido && !almacenSolicitado) return null

    let nombreAlmacenElegido = K.ALMACENES[almacenElegido] || null
    let nombreAlmacenSolicitado = K.ALMACENES[almacenSolicitado] || null

    if (formato === 'corto') {

        if (!nombreAlmacenElegido) {
            return (
                <span className="text-monospace">
                    <Icono icono={FaWarehouse} posicion={[16, 0]} className="text-info mr-1" />
                    <abbr className="text-decoration-none text-warning" title="Desconocido">{almacenElegido}</abbr>
                </span>
            )
        }
        return (
            <span className="text-monospace">
                <Icono icono={FaWarehouse} posicion={[16, 0]} className="text-info mr-1" />
                <abbr className="text-decoration-none" title={nombreAlmacenElegido}>{almacenElegido}</abbr>
            </span>
        )
    }

    if (!nombreAlmacenElegido) {
        return (
            <span className="text-monospace">
                <Icono icono={FaWarehouse} posicion={[16, 0]} className="text-info mr-1" />
                <abbr className="text-decoration-none text-warning" title={almacenElegido}>Desconocido</abbr>
            </span>
        )
    } else if (nombreAlmacenSolicitado && nombreAlmacenSolicitado !== nombreAlmacenElegido) {
        return (
            <span className="text-monospace">
                <Icono icono={FaWarehouse} posicion={[16, 0]} className="text-info mr-1" />
                <abbr className="text-decoration-none" title={almacenElegido}>{nombreAlmacenElegido}</abbr>
                <del className="ml-1 text-muted">{almacenSolicitado}</del>
            </span>
        )
    }
    return (
        <span className="text-monospace">
            <Icono icono={FaWarehouse} posicion={[16, 0]} className="text-info mr-1" />
            <abbr className="text-decoration-none" title={almacenElegido}>{nombreAlmacenElegido}</abbr>
        </span>
    )



}

export default AlmacenServicio