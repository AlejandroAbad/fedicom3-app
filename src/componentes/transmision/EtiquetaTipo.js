import K from 'K'
import React from 'react'
import { Badge, Popover, OverlayTrigger } from 'react-bootstrap'

import './Transmision.scss'

const getTipo = (codigoTipo) => {
    return K.TIPOS_TRANSMISION[codigoTipo] || { codigo: codigoTipo, filtrable: false, titulo: 'Desconocido', descripcion: 'No se conoce el tipo', variante: 'danger' }
}

const popover = (tipo) => {
    let className = 'border border-' + tipo.variante
    return (
        <Popover id="popover-basic" className={className}>
            <Popover.Title as="h3" variant={tipo.variante}>
                {tipo.titulo}
                <Badge className="ml-3 float-right text-monospace" variant="dark">{tipo.codigo}</Badge>
            </Popover.Title>
            <Popover.Content>
                {tipo.descripcion}
            </Popover.Content>
        </Popover>
    )
}

const EtiquetaTipo = ({ tipo, ...props }) => {

    let datosTipo = getTipo(tipo)

    return (
        <OverlayTrigger trigger="hover" overlay={popover(datosTipo)} placement="bottom">
            <Badge pill size="lg" variant={datosTipo.variante} className="EtiquetaTipo" >{datosTipo.titulo}</Badge>
        </OverlayTrigger>
    );
};

export default EtiquetaTipo