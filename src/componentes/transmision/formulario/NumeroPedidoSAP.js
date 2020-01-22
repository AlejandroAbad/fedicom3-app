import React from 'react'
import InputMolon from './InputMolon'



const NumeroPedidoSAP = (props) => {

    return (
        <InputMolon {...props}
            regexSplit={/[\s\r\n,.-]+/}
            regexValidate={/^[0-9]{10}$/i}
            rutaFiltro="numerosPedidoSAP"
            titulo="Números de pedido SAP"
        />
    )
}

export default NumeroPedidoSAP