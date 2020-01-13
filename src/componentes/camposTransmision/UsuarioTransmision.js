import React from 'react';


import { CodigoCliente, TextoCodigoCliente } from 'componentes/camposTransmision/CodigoCliente';
import { Row, Col } from 'react-bootstrap';
import { IoIosPerson, IoMdKey } from 'react-icons/io';


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

    let textoSuperior = null;
    let textoInferior = null;

    if (codigoCliente.isVacio()) {
            textoInferior = <TextoCodigoCliente codigo={usuarioAutenticado} />
    } else {

        if (!codigoClienteSap || codigoClienteSap.isVacio() || codigoCliente.codigoOriginal === codigoClienteSap.codigoOriginal) {
            textoSuperior = <TextoCodigoCliente codigo={codigoCliente} />
        } else {

            textoSuperior = <><TextoCodigoCliente codigo={codigoCliente} /> &raquo; <TextoCodigoCliente codigo={codigoClienteSap} /></>
        }


        if (usuarioAutenticado.isVacio()) {
            textoInferior = (<>
                <small style={{ fontVariant: 'small-caps' }}>Sin autenticar</small>
            </>);
        } else {
            if (!codigoCliente.equals(usuarioAutenticado)) {
                textoInferior = (<>
                    <TextoCodigoCliente codigo={usuarioAutenticado} />
                    <small style={{ fontVariant: 'small-caps' }}> en nombre de</small>
                </>);
            }
        }
    }

    return (
        <Row className="p-0 m-0 no-gutters">
            {textoInferior && <Col lg={12}><IoMdKey className="text-info" size={18} /> {textoInferior}</Col>}
            {textoSuperior && <Col lg={12}><IoIosPerson className="text-info" size={18} /> {textoSuperior}</Col>}
        </Row>
    )





};

export default UsuarioTransmision;

