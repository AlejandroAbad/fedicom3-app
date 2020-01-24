import K from 'K'
import React from 'react'
import { Badge, Popover, OverlayTrigger } from 'react-bootstrap'

import './Transmision.scss'

const getEstado = (codigoEstado) => {
    return K.ESTADOS_TRANSMISION[codigoEstado] || { codigo: codigoEstado, 
        filtrable: false, 
        titulo: 'Desconocido', 
        descripcion: 'No se conoce el estado.', 
        variante: 'danger'
    }
}

const popover = (estado) => {
    let className = 'border border-' + estado.variante
    return (
        <Popover id="popover-basic" className={className}>
            <Popover.Title as="h3" variant={estado.variante}>
                {estado.titulo}
                <Badge className="float-right text-monospace" variant="dark">{estado.codigo}</Badge>
            </Popover.Title>
            <Popover.Content>
                {estado.descripcion}
            </Popover.Content>
        </Popover>
    )
}

const EtiquetaEstado = ({ estado, ...props }) => {

    let datosEstado = getEstado(estado)

    return (
        <OverlayTrigger trigger="hover" overlay={popover(datosEstado)} placement="bottom">
            <Badge pill size="lg" variant={datosEstado.variante} className="EtiquetaEstado" >{datosEstado.titulo}</Badge>
        </OverlayTrigger>
    )
}

export default EtiquetaEstado