import React from 'react'
import InputMolon from './InputMolon'



const TxId = (props) => {

    return (
        <InputMolon {...props}
            regexSplit={/[\s\r\n,.-]+/}
            regexValidate={/^[0-9A-F]{24}$/i}
            rutaFiltro="_id"
            nombre="txid"
            titulo="ID de transmisión"
        />
    )
}

export default TxId