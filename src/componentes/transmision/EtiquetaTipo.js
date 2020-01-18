import K from 'K'
import React from 'react'
import { Badge, Popover, OverlayTrigger } from 'react-bootstrap'

import './Transmision.scss'

const getTipo = (tipo) => {
    return K.TIPOS_TRANSFERENCIA[tipo] || [tipo, 'Desconocido', 'No se conoce el tipo', 'danger']
}

const popover = (tipo) => {
    let className = 'border border-' + tipo[3]
    return (
        <Popover id="popover-basic" className={className}>
            <Popover.Title as="h3" variant={tipo[3]}>
                {tipo[1]}
                <Badge className="ml-3 float-right text-monospace" variant="dark">{tipo[0]}</Badge>
            </Popover.Title>
            <Popover.Content>
                {tipo[2]}
            </Popover.Content>
        </Popover>
    )
}

const EtiquetaTipo = ({ tipo, ...props }) => {

    let datosTipo = getTipo(tipo)

    return (
        <OverlayTrigger trigger="hover" overlay={popover(datosTipo)} placement="bottom">
            <Badge pill size="lg" variant={datosTipo[3]} className="EtiquetaTipo" >{datosTipo[1]}</Badge>
        </OverlayTrigger>
    );
};

export default EtiquetaTipo