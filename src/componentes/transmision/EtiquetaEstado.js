import K from 'K'
import React from 'react'
import { Badge, Popover, OverlayTrigger } from 'react-bootstrap'

import './Transmision.scss'

const getEstado = (estado) => {
    return K.ESTADOS_TRANSFERENCIA[estado] || [estado, 'Desconocido', 'No se conoce el estado', 'danger']
}

const popover = (estado) => {
    let className = 'border border-' + estado[3]
    return (
        <Popover id="popover-basic" className={className}>
            <Popover.Title as="h3" variant={estado[3]}>
                {estado[1]}
                <Badge className="float-right text-monospace" variant="dark">{estado[0]}</Badge>
            </Popover.Title>
            <Popover.Content>
                {estado[2]}
            </Popover.Content>
        </Popover>
    )
}

const EtiquetaEstado = ({ estado, ...props }) => {

    let datosEstado = getEstado(estado)

    return (
        <OverlayTrigger trigger="hover" overlay={popover(datosEstado)} placement="bottom">
            <Badge pill size="lg" variant={datosEstado[3]} className="EtiquetaEstado" >{datosEstado[1]}</Badge>
        </OverlayTrigger>
    )
}

export default EtiquetaEstado