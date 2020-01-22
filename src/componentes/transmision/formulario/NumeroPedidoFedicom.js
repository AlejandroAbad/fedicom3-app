import React from 'react'
import InputMolon from './InputMolon'



const NumeroPedidoFedicom = (props) => {

    return (
        <InputMolon {...props}
            regexSplit={/[\s\r\n,.-]+/}
            regexValidate={/^[0-9A-F]{24}$/i}
            rutaFiltro="crc"
            titulo="Número pedido Fedicom"
        />
    )
}

export default NumeroPedidoFedicom