import React from 'react';
import { Badge, Popover, OverlayTrigger } from 'react-bootstrap';

import { GiMedicines } from 'react-icons/gi';
import { MdControlPointDuplicate, MdBugReport, MdAirplanemodeActive, MdPortableWifiOff, MdTimer } from 'react-icons/md';
import { FaDatabase, FaRetweet, FaPercentage, FaCreativeCommonsNc, FaRadiation } from 'react-icons/fa'

const FlagPopover = (props) => {

    let { variant, icono, titulo, descripcion } = props;
    let iconComponent = null;
    if (icono) {
        iconComponent = new icono({
            size: 14,
            className: 'mb-1'
        });
    }


    let className = 'border border-' + variant;
    return (
        <Popover id="popover-basic" className={className}>
            <Popover.Title as="h3" variant={variant}>
                {iconComponent} {titulo}
            </Popover.Title>
            <Popover.Content>
                {descripcion}
            </Popover.Content>

        </Popover>
    )
}

const BadgeFlag = (props) => {

    let { icono, titulo, tecnico, formato, ...rest } = props;
    let iconComponent = null;
    if (icono) {
        iconComponent = new icono({
            size: 14,
            className: (formato !== 'corto' ? 'mr-1' : '')
        });
    }

    rest.size = "lg";
    rest.pill = true;
    rest.className += ' py-1 mx-1 text-lowercase';
    if (!rest.style) rest.style = {}
    rest.style.fontVariant = 'small-caps';

    return (
        <OverlayTrigger trigger="hover" overlay={FlagPopover(props)} placement="bottom">
            <Badge {...rest}>{iconComponent || null}{formato !== 'corto' && titulo}</Badge>
        </OverlayTrigger>
    )

}


const DEFINICION_FLAGS = {
    sqlite: { variant: "danger", titulo: "SQLite", icono: FaDatabase, descripcion: "La transmisión ha sido almacenada temporalmente en la base de datos SQLite y posteriormente migrada a MongoDB.", tecnico: true },
    retransUpd: { variant: "info", titulo: "Actualizado", icono: FaRetweet, descripcion: "El pedido ha sido retransmitido a SAP y esto ha provocado que los datos de este varíen." },
    retransNoUpd: { variant: "danger", titulo: "Retransmitido", icono: FaRetweet, descripcion: "El pedido ha sido retransmitido a SAP, pero este no se ha visto modificado." },
    watchdog: { variant: "warning", titulo: "Recuperado", icono: MdBugReport, descripcion: "El estado del pedido ha sido recuperado por el WatchDog.", tecnico: true },
    noSap: { variant: "danger", titulo: "Sin faltas", icono: MdPortableWifiOff, descripcion: "No se devolvieron faltas para este pedido." },
    estupe: { variant: "success", titulo: "Estupe", icono: GiMedicines, descripcion: "El pedido contiene algún producto estupefaciente." },
    dupes: { variant: "warning", titulo: "Duplicados", icono: MdControlPointDuplicate, descripcion: "Esta transmisión se ha sido recibido varias veces. El resto de transmisiones se marcaron como duplicadas." },
    bonif: { variant: "success", titulo: "Bonificado", icono: FaPercentage, descripcion: "El pedido contiene líneas bonificadas." },
    transfer: { variant: "primary", titulo: "Transfer", icono: MdAirplanemodeActive, descripcion: "El pedido lo realiza un laboratorio." },
    faltaTotal: { variant: "secondary", titulo: "Falta Total", icono: FaCreativeCommonsNc, descripcion: "Todas las líneas del pedido son falta total. No se servirá nada." },
    formato: { variant: "warning", titulo: "Formato", icono: FaRadiation, descripcion: (<span>La transmisión tiene incidencias de forma. Por ejemplo, campos de tipo numérico que se mandan como texto (<code>"1"</code> en lugar de <code>1</code>) o fechas mal formateadas.</span>), tecnico: true },
    demorado: { variant: "primary", titulo: "Demorado", icono: MdTimer, descripcion: (<span>El pedido contiene al menos una línea donde se ha sugerido un envío demorado.</span>) },
}


const Flags = (props) => {

    const { flags, formato } = props;

    if (!flags) return null;
    let index = 0;
    let flagBadges = [];
    for (var flag in flags) {
        let propiedades = DEFINICION_FLAGS[flag];
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