import React from 'react';

import { MdAccessTime} from 'react-icons/md';

const dateToHuman = (date) => {
    date = new Date(date);

    return date.getDate().toString().padStart(2, '0') + '/' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
        date.getFullYear() + ' ' +
        date.toLocaleTimeString('es-ES');

}


const Fecha = (props) => {

    let cadena = dateToHuman(props.fecha);

    return <h6><MdAccessTime size={18} className="text-info" style={{paddingBottom: '3px'}} />{cadena}</h6>;


}

export default Fecha;