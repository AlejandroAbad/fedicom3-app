import React from 'react';


import { CodigoCliente, TextoCodigoCliente } from 'componentes/fedicom/CodigoCliente';



/*
1)  |   codCli

2)  |   codCli > codSap

3)  |   codCli
    |   user

4)  |   codCli > codSap
    |   user

5)  |   codCli
    |   *Sin auth

6)  |   codCli > codSap
    |   *Sin auth

7)  |   user

8)  |   Desconocido
*/


const UsuarioTransmision = (props) => {

    let tx = props.transmision;


    let codigoCliente = new CodigoCliente(tx.client);
    let usuarioAutenticado = new CodigoCliente(tx.authenticatingUser);
    let codigoClienteSap = new CodigoCliente(tx.sapResponse && tx.sapResponse.body ? tx.sapResponse.body.sap_cliente : null);

    
    if (codigoCliente.isVacio()) {
        // Si no hay codigo cliente, esto cubre los casos 7 y 8
        return <TextoCodigoCliente codigo={usuarioAutenticado} />
    }

    let textoSuperior = null;
    if (!codigoClienteSap) {
        textoSuperior = <TextoCodigoCliente codigo={codigoCliente} />
    } else {
        textoSuperior = <><TextoCodigoCliente codigo={codigoCliente} /> &raquo; <TextoCodigoCliente codigo={codigoClienteSap} /></>
    }

    let textoInferior = null;
    if (usuarioAutenticado.isVacio()) {
        textoInferior = <span className="text-muted font-italic">Sin autenticar</span>;
    } else {
        if (!codigoCliente.equals(usuarioAutenticado)) {
            textoInferior = <TextoCodigoCliente codigo={usuarioAutenticado} />
        }
    }


    return (
        <>
            <small style={{fontVariant: 'small-caps'}}>Cliente: </small>{textoSuperior}
            {textoInferior && <>
                <br /><small style={{ fontVariant: 'small-caps' }}>Como: </small>{textoInferior}
            </>}
        </>
    )





};

export default UsuarioTransmision;

