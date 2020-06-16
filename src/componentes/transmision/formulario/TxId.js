import React from 'react'
import InputMolon from './InputMolon'
import { ObjectId, EJSON } from 'bson'



const TxId = (props) => {

    return (
        <InputMolon {...props}
            regexSplit={/[\s\r\n,.-]+/}
            regexValidate={/^[0-9A-F]{24}$/i}
            rutaFiltro="@id"
            titulo="ID de transmisión"
        />
    )
}

TxId.expandirOpciones = (filtro) => {
    if (!filtro) return;

    let valores = filtro['@id']?.$in;
    if (!valores)    return;

    let valoresConvertidos = [];

    valores.forEach(valor => {
        try {
            valoresConvertidos.push(new ObjectId(valor))
        } catch(e) {
            console.error('Se ignora el valor de ID de transmisión por no ser OID', valor);
        }
    });


    filtro._id = EJSON.serialize({
        $in: valoresConvertidos
    });

}

export default TxId