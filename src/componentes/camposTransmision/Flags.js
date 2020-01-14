import React from 'react';
import { Badge, Popover, OverlayTrigger } from 'react-bootstrap';

import { GiMedicines } from 'react-icons/gi';
import { MdControlPointDuplicate, MdBugReport, MdAirplanemodeActive, MdPortableWifiOff } from 'react-icons/md';
import { FaDatabase, FaRetweet, FaPercentage, FaCreativeCommonsNc, FaRadiation } from 'react-icons/fa'

const FlagPopover = (props) => {

    let {variant, icono, titulo, descripcion} = props;
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

    // TODO: Un 

    let { icono, titulo, tecnico, ...rest } = props;
    let iconComponent = null;
    if (icono) {
        iconComponent = new icono({
            size: 14
        });
    }

    rest.size = "lg";
    rest.pill = true;
    rest.className += ' py-1 mx-1 text-lowercase';
    if (!rest.style) rest.style = {}
    rest.style.fontVariant = 'small-caps';

    return (
        <OverlayTrigger trigger="hover" overlay={FlagPopover(props)} placement="bottom">
            <Badge {...rest}>{iconComponent || null} {titulo}</Badge>
        </OverlayTrigger>
    )

}

let index = 0;
const FLAG_BADGES = {
    sqlite: <BadgeFlag key={index++} variant="danger" titulo="SQLite" icono={FaDatabase} descripcion="La transmisión ha sido almacenada temporalmente en la base de datos SQLite y posteriormente migrada a MongoDB." tecnico />,
    retransUpd: <BadgeFlag key={index++} variant="info" titulo="Actualizado" icono={FaRetweet} descripcion="El pedido ha sido retransmitido a SAP y esto ha provocado que los datos de este varíen." />,
    retransNoUpd: <BadgeFlag key={index++} variant="danger" titulo="Retransmitido" icono={FaRetweet} descripcion="El pedido ha sido retransmitido a SAP, pero este no se ha visto modificado." />,
    watchdog: <BadgeFlag key={index++} variant="warning" titulo="Recuperado" icono={MdBugReport} descripcion="El estado del pedido ha sido recuperado por el WatchDog." tecnico />,
    noSap: <BadgeFlag key={index++} variant="danger" titulo="Sin faltas" icono={MdPortableWifiOff} descripcion="No se devolvieron faltas para este pedido." />,
    estupe: <BadgeFlag key={index++} variant="success" titulo="Estupe" icono={GiMedicines} descripcion="El pedido contiene algún producto estupefaciente." />,
    dupes: <BadgeFlag key={index++} variant="warning" titulo="Duplicados" icono={MdControlPointDuplicate} descripcion="Esta transmisión se ha sido recibido varias veces. El resto de transmisiones se marcaron como duplicadas." />,
    bonif: <BadgeFlag key={index++} variant="success" titulo="Bonificado" icono={FaPercentage} descripcion="El pedido contiene líneas bonificadas." />,
    transfer: <BadgeFlag key={index++} variant="primary" titulo="Transfer" icono={MdAirplanemodeActive} descripcion="El pedido lo realiza un laboratorio." />,
    faltaTotal: <BadgeFlag key={index++} variant="secondary" titulo="Falta Total" icono={FaCreativeCommonsNc} descripcion="Todas las líneas del pedido son falta total. No se servirá nada." />,
    formato: <BadgeFlag key={index++} variant="warning" titulo="Formato" icono={FaRadiation} descripcion={<span>La transmisión tiene incidencias de forma. Por ejemplo, campos de tipo numérico que se mandan como texto (<code>"1"</code> en lugar de <code>1</code>) o fechas mal formateadas.</span>} tecnico />,
}


const Flags = (props) => {

    let flags = props.flags;
    if (!flags) return null;

    let flagBadges = [];
    for (var flag in flags) {
        if (flags[flag] === true && FLAG_BADGES[flag]) 
            flagBadges.push(FLAG_BADGES[flag]);
    }


    return (<>
        {flagBadges}
    </>);
}

export default Flags;