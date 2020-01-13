import React from 'react';
import { Badge } from 'react-bootstrap';

import { GiMedicines, GiFactory } from 'react-icons/gi';
import { MdControlPointDuplicate, MdExposurePlus1 } from 'react-icons/md';
import { FaDatabase } from 'react-icons/fa'

const Flags = (props) => {

    let flags = props.flags;

    return (<>
        <BadgeFlag variant="primary" titulo="Estupe" icon={GiMedicines} />
        <BadgeFlag variant="warning" titulo="Duplicados" icon={MdControlPointDuplicate}/>
        <BadgeFlag variant="danger" titulo="SQLite" icon={FaDatabase} />
        <BadgeFlag variant="info" titulo="Bonificación" icon={MdExposurePlus1} />
        <BadgeFlag variant="secondary" titulo="Transfer" icon={GiFactory} />
    </>);
}

const BadgeFlag = (props) => {

    let { icon, titulo, ...rest } = props;
    let iconComponent = null;
    if (icon) {
        iconComponent = new icon({
            size: 14
        });
    }

    rest.size = "lg";
    rest.pill = true;
    rest.className += ' mx-1 text-lowercase';
    if (!rest.style) rest.style = {}
    rest.style['font-variant'] = 'small-caps';

    return <Badge {...rest}>{iconComponent || null} {titulo}</Badge>

}

export default Flags;