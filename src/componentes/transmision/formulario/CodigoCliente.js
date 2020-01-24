import React from 'react'
import InputMolon from './InputMolon'



const CodigoCliente = (props) => {

    return (
        <InputMolon {...props}
            regexSplit={/[\s\r\n,.-]+/}
            rutaFiltro="@cliente"
            titulo="Codigo de cliente"
        />
    )


}

CodigoCliente.expandirOpciones = (filtro) => {
    if (!filtro) return

    let codigos = filtro['@cliente']?.$in


    let client = [];
    let authenticatingUser = [];
    let clienteSap = [];
    let puntoEntrega = [];

    if (codigos && codigos.length > 0) {
        codigos.forEach(cod => {
            let extCod = explotarCliente(cod);
            if (extCod.client) client = client.concat(extCod.client)
            if (extCod.authenticatingUser) authenticatingUser = authenticatingUser.concat(extCod.authenticatingUser)
            if (extCod.clienteSap) clienteSap = clienteSap.concat(extCod.clienteSap)
            if (extCod.puntoEntrega) puntoEntrega = puntoEntrega.concat(extCod.puntoEntrega)
        })
    }

    if (!filtro.$or) filtro.$or = [];


    if (client.length) filtro.$or.push({ 'client': { $in: client } })
    if (authenticatingUser.length) filtro.$or.push({ 'authenticatingUser': { $in: authenticatingUser } })
    if (clienteSap.length) filtro.$or.push({ 'sapResponse.body.sap_cliente': { $in: clienteSap } })
    if (puntoEntrega.length) filtro.$or.push({ 'flags.pt': { $in: puntoEntrega } })
}

const explotarCliente = (codigo) => {
    if (!codigo) return {};
    if (codigo.match(/^[0-9]+$/)) {
        if (codigo.length <= 5) {
            return {
                client: [codigo, ...expandirSociedades(codigo, 8), ...expandirSociedades(codigo, 10)],
                authenticatingUser: expandirSociedades(codigo, 8, '@hefame'),
                clienteSap: expandirSociedades(codigo, 10),
                puntoEntrega: expandirSociedades(codigo, 10, null, 'PT')
            }
        } else if (codigo.length < 10) {
            return {
                client: [codigo, codigo.padStart(10, '0')],
                authenticatingUser: [codigo + '@hefame'],
                clienteSap: [codigo.padStart(10, '0')],
                puntoEntrega: ['PT' + codigo.padStart(10, '0')]
            }
        } else if (codigo.length === 10) {
            return {
                client: [codigo],
                clienteSap: [codigo],
                puntoEntrega: ['PT' + codigo]
            }
        } else {
            return {
                authenticatingUser: [codigo]
            }
        }
    } else {
        if (codigo.startsWith('PT')) {
            return {
                puntoEntrega: [codigo]
            }
        }
        return {
            authenticatingUser: [codigo]
        }
    }

}

const SOCIEDADES = ['101', '180', '208', '2901']

const expandirSociedades = (codigo, largo = 8, append = null, prepend = null) => {
    return SOCIEDADES.map(vkorg => {
        return (prepend ?? '') + (vkorg + codigo.padStart(5, '0')).padStart(largo, '0') + (append ?? '');
    })

}

export default CodigoCliente