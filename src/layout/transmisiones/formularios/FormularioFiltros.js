import React from 'react'
import { useForm } from "react-hook-form"
import { Container } from 'react-bootstrap'

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

        let filtro = {};

        for (let key in valores) {
            if (valores[key])
                filtro[key.replace(/_DOT_/g, '.')] = valores[key]
        }


        // Para cada control que haya definido, vamos a ver si tiene definida la funcion 'expandirOpciones' y en caso afirmativo
        // la llamamos pasandole el filtro. Cada control debe modificar el filtro para convertirlo en algo que sea aceptable por el API

        for (let campoControl in Controles ) {
            if (Controles[campoControl]?.expandirOpciones) {
                Controles[campoControl].expandirOpciones(filtro);
            }
        }
        

        if (onAceptar) {
            onAceptar(filtro)
        }
    }



    return (<>
        

        <Container className="pt-3 container-xl">
            <CabeceraFormulario icono={FiFilter} texto="Filtrar" onCancelar={descartarCambios} onAceptar={hookFormulario.handleSubmit(aplicarCambios)} />

            <Controles.Crc filtro={filtro} {...hookFormulario} />
            <Controles.FechaCreacion filtro={filtro} {...hookFormulario} />
            <Controles.CodigoCliente filtro={filtro} {...hookFormulario} />
            <Controles.Flags filtro={filtro} {...hookFormulario} />
            <hr />
            <Controles.TxId filtro={filtro} {...hookFormulario} />
            <Controles.TipoTransmision filtro={filtro} {...hookFormulario} />
            <Controles.EstadoTransmision filtro={filtro} {...hookFormulario} />
            <Controles.NumeroPedidoFedicom filtro={filtro} {...hookFormulario} />
            <Controles.NumeroPedidoOrigen filtro={filtro} {...hookFormulario} />
            <Controles.NumeroPedidoSAP filtro={filtro} {...hookFormulario} />
            <hr />
            <Controles.SoftwareEmisor filtro={filtro} {...hookFormulario} />
            

        </Container>


    </>)
}





export default FormularioFiltros