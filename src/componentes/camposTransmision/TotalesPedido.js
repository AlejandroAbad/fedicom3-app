import React from 'react';

//import { MdFormatListNumbered, MdAdd, MdRemove } from 'react-icons/md';
import { FiPackage, FiThumbsDown, FiThumbsUp } from 'react-icons/fi';


const Totales = (props) => {

    let tx = props.transmision;
    let t = (tx && tx.flags) ? tx.flags.s : null;

    if (!t) return null;

    let estiloIconos = { paddingBottom: '2px', marginRight: '2px' };

    let cantidad = null;
    if (t.cantidadBonificacion) {
        cantidad = (<>
            {' '}
            < FiThumbsUp className="text-success" size={18} style={estiloIconos} />{t.cantidad}+{t.cantidadBonificacion}
        </>);
    } else {
        cantidad = (<>
            {' '}
            < FiThumbsUp className="text-success" size={18} style={estiloIconos} />{t.cantidad}
        </>);
    }

    let faltas = null;
    if (t.cantidadFalta || t.cantidadBonificacionFalta)
        if (t.cantidadBonificacionFalta) {
            faltas = (<span className="text-danger">
                <FiThumbsDown className="text-danger" size={18} style={estiloIconos} />{t.cantidadFalta}+{t.cantidadBonificacionFalta}
            </span>);
        } else {
            faltas = (<span className="text-danger">
                <FiThumbsDown size={18} style={estiloIconos} />{t.cantidadFalta}
            </span>
            );
        }


    return <code className="text-reset">
        <FiPackage className="text-info" size={18} style={estiloIconos} />{t.lineas} {cantidad} {faltas}
    </code>;


}

export default Totales;