import React from 'react'
import InputMolon from './InputMolon'



const Crc = (props) => {

    return (
        <InputMolon {...props}
            regexSplit={/[\s\r\n,.-]+/}
            regexValidate={/^[0-9A-F]{8}$/i}
            rutaFiltro="sapResponse.body.crc"
            titulo="CRC de transmisión"
        />
    )
}

export default Crc