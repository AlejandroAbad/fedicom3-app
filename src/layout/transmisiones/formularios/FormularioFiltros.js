import React from 'react'
import { useForm } from "react-hook-form"
import { Container, Row, Col } from 'react-bootstrap'
import ReactJson from 'react-json-view'

import { FiFilter } from 'react-icons/fi'

import Controles from 'componentes/transmision/formulario/Controles'
import CabeceraFormulario from './CabeceraFormulario'



const exprimeValores = (valorSelect) => {
    return valorSelect.map(v => v.value)
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

        if (valores.crc) filtro['sapResponse.body.crc'] = valores.crc;
        if (valores.txid) filtro._id = valores.txid;
        if (valores.numeroPedidoFedicom) filtro.crc = valores.numeroPedidoFedicom;
        if (valores.numeroPedidoOrigen) filtro['clientRequest.body.numeroPedidoOrigen'] = valores.numeroPedidoOrigen;
        if (valores.numerosPedidoSAP) {
            filtro.numerosPedidoSAP = { $in: exprimeValores(valores.numerosPedidoSAP) }
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