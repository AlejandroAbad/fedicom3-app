import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { MdViewHeadline, MdViewStream } from 'react-icons/md';
import { FiFilter } from 'react-icons/fi';
import { FaSortAmountDown } from 'react-icons/fa';

import './MenuBusqueda.scss';
import MenuPaginacion from 'componentes/menuPaginacion/MenuPaginacion';




const Elemento = (props) => {

    let className = 'page-item ' +
        (props.deshabilitado ? 'disabled' : '') +
        (props.activo ? 'active' : '');

    let linkStyle = { height: '40px', width: '46px' }

    let icono = new props.icono({ size: 20, style: { marginBottom: '2px' } })

    let callback = () => { }
    if (!props.deshabilitado && !props.activo) {
        linkStyle.cursor = 'pointer'
        callback = props.onClick || (() => { })
    }

    return (<li className={className}>
        <span className="page-link text-center" role="button" style={linkStyle} onClick={callback}>
            {icono}
        </span>
    </li>)
}

const MenuBusqueda = (props) => {

    const { /*query,*/ resultado, formato, onLimiteCambiado, onPaginaCambiada, onFormatoCambiado} = props;

    if (!resultado.datos) return null;
    const { limit, skip, total} = resultado.datos;

    // Configuracion del paginador
    let pagMax = Math.floor((total/limit) + 1);
    let pagActual = (skip / limit) + 1;

    // Configuracion del limitador de resultados
    let limitOptions = [];
    let stepSize = 10;
    if (limit < stepSize) limitOptions.push(<option value={limit} key={limit}>{limit}</option>)
    for (let i = stepSize; i <= 50; i = i + stepSize) {
        if (i > stepSize && limit < i && limit > (i - stepSize) )
            limitOptions.push(<option value={limit} key={limit}>{limit}</option>)
        limitOptions.push(<option value={i} key={i}>{i}</option>)
    }
    if (limit > 50) limitOptions.push(<option value={limit} key={limit}>{limit}</option>)
    
    
    const paginaCambiada = (pagina) => {
        if (onPaginaCambiada)
            onPaginaCambiada(pagina);
    }

    const cambiarFormato = (formato) => {
        if (onFormatoCambiado)
            onFormatoCambiado(formato);
    }


    return (
        <Row className="border-bottom no-gutters MenuBusqueda">
            <Col className="" sm={8} xs={12}>
                <MenuPaginacion min={1} max={pagMax} actual={pagActual} onPaginaCambiada={paginaCambiada} className="mb-2 mx-auto justify-content-center justify-content-sm-start" />
            </Col>
            <Col className="" sm={2} xs={8}>
                <ul className="GrupoBotones float-sm-right mb-2">
                    <Elemento icono={MdViewHeadline} onClick={() => cambiarFormato('compacto')} activo={formato === 'compacto'} />
                    <Elemento icono={MdViewStream} onClick={() => cambiarFormato('normal')} activo={formato === 'normal'} />
                </ul>
            </Col>
            <Col className="pl-2" sm={2} xs={4}>
                <ul className="GrupoBotones float-right">
                    <Elemento icono={FiFilter} />
                    <Elemento icono={FaSortAmountDown} />
                </ul>
            </Col>
            <Col className="align-middle" md={6} sm={7} xs={5}>
                <small className="d-none d-sm-inline mr-1">Mostrar</small>
                <Form.Control as="select" size="sm" value={limit} className="w-auto d-inline-block h-auto" onChange={(e) => onLimiteCambiado(parseInt(e.target.value))}>
                    {limitOptions}
                </Form.Control>
                <small className="d-none d-sm-inline ml-1">transmisiones por página</small>
                <small className="d-sm-none ml-1">tx &#x02A2F; pág</small>
            </Col>
            <Col className="align-middle mb-2 pt-1 text-right" md={6} sm={5} xs={7}>
                <small>Filtrando {total} {total === 1 ? 'transmisión' : 'transmisiones'}</small>
            </Col>

        </Row >
    );
}

export default MenuBusqueda;