import React from 'react'
import { useForm } from "react-hook-form"
import { Container, Row, Col } from 'react-bootstrap'
import ReactJson from 'react-json-view'

import { FiFilter } from 'react-icons/fi'

import Controles from 'componentes/transmision/formulario/Controles'
import CabeceraFormulario from './CabeceraFormulario'



const exprimeValores = (valorSelect) => {
    
    let valores = [];
    valorSelect.forEach( valor => {
        if (!valor.error) {
            valores.push(valor.value)
        }  
    })
    return valores
}

const FormularioFiltros = ({ filtro, onAceptar, onCancelar, ...props }) => {


    const hookFormulario = useForm();

    const descartarCambios = () => {
        if (onCancelar)
            onCancelar()
    }

    const aplicarCambios = (valores) => {
        console.log(valores)

        let filtro = {};

        console.log(valores.crc)
        if (valores.crc) {
            let val = exprimeValores(valores.crc);
            if (val.length) filtro['sapResponse.body.crc'] = { $in: val };
        }
        if (valores.txid) {
            let val = exprimeValores(valores.txid);
            if (val.length) filtro._id = { $in: val }
        }
        if (valores.numeroPedidoFedicom) {
            let val = exprimeValores(valores.numeroPedidoFedicom);
            if (val.length) filtro.crc = { $in: val }
        }
        if (valores.numeroPedidoOrigen) {
            let val = exprimeValores(valores.numeroPedidoOrigen);
            if (val.length) filtro['clientRequest.body.numeroPedidoOrigen'] = { $in: val };
        }
        if (valores.numerosPedidoSAP) {
            let val = exprimeValores(valores.numerosPedidoSAP);
            if (val.length) filtro.numerosPedidoSAP = { $in: val }
        }
        if (valores.tipoTx) {
            filtro.type = { $in: exprimeValores(valores.tipoTx) }
        }
        if (valores.estadoTx) {
            filtro.status = { $in: exprimeValores(valores.estadoTx) }
        }


        console.log(filtro)

        if (onAceptar) {
            onAceptar(filtro)
        }
    }



    return (<>
        <CabeceraFormulario icono={FiFilter} texto="Filtrar" onCancelar={descartarCambios} onAceptar={hookFormulario.handleSubmit(aplicarCambios)} />

        <Container fluid className="pt-3">

            <Controles.Crc filtro={filtro} {...hookFormulario} />
            <Controles.TxId filtro={filtro} {...hookFormulario} />
            <Controles.NumeroPedidoFedicom filtro={filtro} {...hookFormulario} />
            <Controles.NumeroPedidoOrigen filtro={filtro} {...hookFormulario} />
            <Controles.NumeroPedidoSAP filtro={filtro} {...hookFormulario} />
            <Controles.TipoTransmision filtro={filtro} {...hookFormulario} />
            <Controles.EstadoTransmision filtro={filtro} {...hookFormulario} />

        </Container>

        <Container fluid className="mt-5">
            <Row>
                <Col>
                    <ReactJson src={filtro} />
                </Col>
            </Row>
        </Container>

    </>)
}





export default FormularioFiltros