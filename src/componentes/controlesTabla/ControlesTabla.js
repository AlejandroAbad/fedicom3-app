import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { MdViewHeadline, MdViewStream } from 'react-icons/md'
import { FiFilter } from 'react-icons/fi'
import { FaSortAmountDown } from 'react-icons/fa'

import './ControlesTabla.scss'
import Paginador from './Paginador'
import BotonControl from './BotonControl'
import LimitadorResultados from './LimitadorResultados'





const ControlesTabla = ({
    resultado,
    formato,
    funcion,
    onLimiteResultadosCambiado,
    onPaginaCambiada,
    onFormatoCambiado,
    onFuncionCambiada, ...props }) => {


    if (!resultado.datos) return null;
    const { limit, skip, total } = resultado.datos

    // Configuracion del paginador
    let pagMax = Math.floor((total / limit) + 1)
    let pagActual = (skip / limit) + 1

    // Configuracion del limitador de resultados
    let limitOptions = []
    let stepSize = 10
    if (limit < stepSize) limitOptions.push(<option value={limit} key={limit}>{limit}</option>)
    for (let i = stepSize; i <= 50; i = i + stepSize) {
        if (i > stepSize && limit < i && limit > (i - stepSize))
            limitOptions.push(<option value={limit} key={limit}>{limit}</option>)
        limitOptions.push(<option value={i} key={i}>{i}</option>)
    }
    if (limit > 50) limitOptions.push(<option value={limit} key={limit}>{limit}</option>)


    const cambiarPagina = (pagina) => {
        if (onPaginaCambiada)
            onPaginaCambiada(pagina)
    }

    const cambiarLimiteResultados = (limite) => {
        if (onLimiteResultadosCambiado)
            onLimiteResultadosCambiado(parseInt(limite))
    }

    const cambiarFormato = (formato) => {
        if (onFormatoCambiado)
            onFormatoCambiado(formato)
    }

    const cambiarFuncion = (funcion) => {
        if (onFuncionCambiada)
            onFuncionCambiada(funcion)
    }


    return (
        <Row className="border-bottom no-gutters ControlesTabla">
            <Col className="" sm={8} xs={12}>
                <Paginador min={1} max={pagMax} actual={pagActual} onPaginaCambiada={cambiarPagina} className="mb-2 mx-auto justify-content-center justify-content-sm-start" />
            </Col>
            <Col className="" sm={2} xs={8}>
                <ul className="GrupoBotones float-sm-right mb-2">
                    <BotonControl icono={MdViewHeadline} onClick={() => cambiarFormato('compacto')} activo={formato === 'compacto'} />
                    <BotonControl icono={MdViewStream} onClick={() => cambiarFormato('normal')} activo={formato === 'normal'} />
                </ul>
            </Col>
            <Col className="pl-2" sm={2} xs={4}>
                <ul className="GrupoBotones float-right">
                    <BotonControl icono={FiFilter} onClick={() => cambiarFuncion('filtro')} activo={funcion === 'filtro'} />
                    <BotonControl icono={FaSortAmountDown} onClick={() => cambiarFuncion('orden')} activo={funcion === 'orden'} />
                </ul>
            </Col>
            <Col className="align-middle" md={6} sm={7} xs={5}>
                <small className="d-none d-sm-inline mr-1">Mostrar</small>
                <LimitadorResultados actual={limit} salto={10} max={50} onLimiteCambiado={cambiarLimiteResultados} />
                <small className="d-none d-sm-inline ml-1">transmisiones por página</small>
                <small className="d-sm-none ml-1">tx &#x02A2F; pág</small>
            </Col>
            <Col className="align-middle mb-2 pt-1 text-right" md={6} sm={5} xs={7}>
                <small>Filtrando {total} {total === 1 ? 'transmisión' : 'transmisiones'}</small>
            </Col>

        </Row >
    )
}

export default ControlesTabla