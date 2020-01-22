import K from 'K'
import React from 'react'
import { Badge, Popover, OverlayTrigger } from 'react-bootstrap'


import Icono from 'componentes/icono/Icono'

import './Transmision.scss'

const FlagPopover = (icono, titulo, descripcion, variante) => {

    let iconComponent = icono ? <Icono icono={icono} posicion={[14]} className="mb-1 mr-1" /> : null
    let className = 'border border-' + variante

    return (
        <Popover className={className}>
            <Popover.Title as="h3" variant={variante}>
                {iconComponent}{titulo}
            </Popover.Title>
            <Popover.Content>
                {descripcion}
            </Popover.Content>
        </Popover>
    )
}

export const BadgeFlag = ({ icono, titulo, descripcion, variante, tecnico, formato, ...props }) => {

    let iconComponent = icono ? <Icono icono={icono} posicion={[14]} className={formato !== 'corto' ? 'mr-1' : ''} /> : null

    return (
        <OverlayTrigger trigger="hover" overlay={FlagPopover(icono, titulo, descripcion, variante)} placement="bottom">
            <Badge pill size="lg" variant={variante} className="EtiquetaFlag mr-1" {...props}>
                {iconComponent}
                {formato !== 'corto' && titulo}
            </Badge>
        </OverlayTrigger>
    )

}

const Flags = ({ flags, formato, ...props }) => {

    if (!flags) return null;

    let index = 0;
    let flagBadges = [];
    for (var flag in flags) {
        let propiedades = K.FLAGS[flag];
        if (flags[flag] === true && propiedades) {
            flagBadges.push(
                <BadgeFlag key={++index} {...propiedades} formato={formato || 'normal'} />
            )
        }
    }

    return (<>
        {flagBadges}
    </>);
}

export default Flags;