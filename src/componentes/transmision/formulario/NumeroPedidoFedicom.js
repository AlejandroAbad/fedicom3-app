import React from 'react'
import InputMolon from './InputMolon'
import { ObjectId, EJSON } from 'bson'



const NumeroPedidoFedicom = (props) => {

    return (
        <InputMolon {...props}
            regexSplit={/[\s\r\n,.-]+/}
            regexValidate={/^[0-9A-F]{24}$/i}
            rutaFiltro="@crc"
            titulo="Número pedido Fedicom"
        />
    )
}


NumeroPedidoFedicom.expandirOpciones = (filtro) => {
    if (!filtro) return;

    let valores = filtro['@crc']?.$in;
    if (!valores) return;

    let valoresConvertidos = [];

    valores.forEach(valor => {
        try {
            valoresConvertidos.push(new ObjectId(valor))
        } catch (e) {
            console.error('Se ignora el valor de NumeroPedidoFedicom por no ser OID', valor);
        }
    });


    filtro.crc = EJSON.serialize({
        $in: valoresConvertidos
    });
}


export default NumeroPedidoFedicom