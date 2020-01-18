import React from 'react';

import { FaTag } from 'react-icons/fa';


const TipoPedido = (props) => {

    let tx = props.transmision;
    let tipoTransmitido = (tx && tx.clientRequest && tx.clientRequest.body) ? tx.clientRequest.body.tipoPedido : null;

    if (!tipoTransmitido) return null;

    return <code className="text-reset"><FaTag size={16} className="text-info" style={{ paddingBottom: '0px' }} /> {tipoTransmitido}</code>;


}

export default TipoPedido;