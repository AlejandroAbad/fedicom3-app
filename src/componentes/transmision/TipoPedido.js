import React from 'react'
import { FaTag } from 'react-icons/fa'
import Icono from 'componentes/icono/Icono'

const TipoPedido = ({ transmision, ...props }) => {

    let tipoTransmitido = (transmision && transmision.clientRequest && transmision.clientRequest.body) ? transmision.clientRequest.body.tipoPedido : null;
    if (!tipoTransmitido) return null

    return (
        <code className="text-reset">
            <Icono icono={FaTag} posicion={[16, 0]} className="text-info mr-1" />
            {tipoTransmitido}
        </code>
    )
}

export default TipoPedido