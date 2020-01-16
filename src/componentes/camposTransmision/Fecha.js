import React from 'react';

import { MdAccessTime} from 'react-icons/md';

const dateToHuman = (date) => {
    date = new Date(date);

    return date.getDate().toString().padStart(2, '0') + '/' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
        date.getFullYear() + ' ' +
        date.toLocaleTimeString('es-ES').padStart(8, '0');

}


const dateToHumanCorto = (date) => {
    date = new Date(date);

    return date.getDate().toString().padStart(2, '0') + '/' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
        (date.getFullYear() % 1000) + ' ' +
        date.toLocaleTimeString('es-ES').padStart(8, '0');

}

const Fecha = (props) => {

    let formato = props.formato || 'normal'
    let cadena = '';
    let icono = null;

    if (formato === 'corto') {
        cadena = dateToHumanCorto(props.fecha);
    } else {
        cadena = dateToHuman(props.fecha);
        icono = <MdAccessTime size={20} className="text-info mr-1" style={{ paddingBottom: '1px' }} />
    }

    return <code className="text-reset">
        {icono}{cadena}
    </code>;



}

export default Fecha;