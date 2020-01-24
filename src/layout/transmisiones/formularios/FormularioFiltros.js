import React from 'react'
import { useForm } from "react-hook-form"
import { Container, Row, Col } from 'react-bootstrap'
import ReactJson from 'react-json-view'

import { FiFilter } from 'react-icons/fi'

import Controles from 'componentes/transmision/formulario/Controles'
import CabeceraFormulario from './CabeceraFormulario'

const FormularioFiltros = ({ filtro, onAceptar, onCancelar, ...props }) => {

    const hookFormulario = useForm();

    const descartarCambios = () => {
        if (onCancelar)
            onCancelar()
    }

    const aplicarCambios = (valores) => {
        console.log(valores)

        let filtro = {};

        for (let key in valores) {
            if (valores[key])
                filtro[key.replace(/_DOT_/g, '.')] = valores[key]
        }

        Controles.CodigoCliente.expandirOpciones(filtro)

        console.group('Parseo filtro')
        console.log(valores, filtro);
        console.groupEnd()

        if (onAceptar) {
            onAceptar(filtro)
        }
    }



    return (<>
        <CabeceraFormulario icono={FiFilter} texto="Filtrar" onCancelar={descartarCambios} onAceptar={hookFormulario.handleSubmit(aplicarCambios)} />

        <Container fluid className="pt-3">

            <Controles.Crc filtro={filtro} {...hookFormulario} />
            <Controles.FechaCreacion filtro={filtro} {...hookFormulario} />
            <Controles.CodigoCliente filtro={filtro} {...hookFormulario} />
            <Controles.Flags filtro={filtro} {...hookFormulario} />
            <hr />
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