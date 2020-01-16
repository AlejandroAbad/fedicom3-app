import React from 'react';
//import { FiChevronsRight, FiChevronsLeft, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { AiOutlineEllipsis } from 'react-icons/ai';

const MenuPaginacion = (props) => {

    const { min, max, actual, onPaginaCambiada, ...rest } = props;
    
    const cambiarPagina = (pagina) => {
        if (onPaginaCambiada)
            onPaginaCambiada(pagina)
    }

    let intermedios = [];
    let elipsisInicio = false;
    let elipsisFin = false;
    let posMin, posActual, posMax;
    for (let i = -4; i <= 4; i++) {
        let valor = actual + i;
        let pos = 4 + i;

        intermedios[pos] = (valor >= min && valor <= max) ? valor : 0;

        if (valor === actual) posActual = pos
        if (valor === min) posMin = pos
        if (valor === max) posMax = pos
    }
    let distanciaInicio = posMin ? posActual - posMin : 4;
    let distanciaFin = posMax ? posMax - posActual : 4;

    let elementosPreservadosInicio = (distanciaInicio > 3) ? Math.max(2, 5 - distanciaFin) : 4 ;
    let elementosPreservadosFin = (distanciaFin > 3) ? Math.max(2, 5 - distanciaInicio) : 4;

    for (let i = posActual - elementosPreservadosInicio; i >= 0; i--) intermedios[i] = 0;
    for (let i = posActual + elementosPreservadosFin ; i < intermedios.length; i++) intermedios[i] = 0;
    

    elipsisFin = (distanciaFin > 3 && max !== 5);
    elipsisInicio = (distanciaInicio > 3 && max !== 5);

    let elementosIntermedios = []
    intermedios.forEach(numero => {
        if (numero) {
            elementosIntermedios.push(<Elemento
                key={numero}
                activo={numero === actual}
                numero={numero}
                onClick={cambiarPagina}>
                {numero}
            </Elemento>)
        }
    })

    rest.className += " GrupoBotones"
    return (
        <ul {...rest} >
            {elipsisInicio && <>
                <Elemento
                    key={min}
                    activo={actual === min}
                    numero={min}
                    onClick={cambiarPagina}>
                    {min}
                </Elemento>
                { max > 7 && <Elipsis /> }
                {max === 7 && <Elemento
                    key={min+1}
                    activo={actual === min+1}
                    numero={min+1}
                    onClick={cambiarPagina}>
                    {min+1}
                </Elemento>}
            </>}

            {elementosIntermedios}

            {elipsisFin && <>
                {max > 7 && <Elipsis />}
                {max === 7 && <Elemento
                    key={max - 1}
                    activo={actual === max - 1}
                    numero={max - 1}
                    onClick={cambiarPagina}>
                    {max - 1}
                </Elemento>}

                <Elemento
                    key={max}
                    activo={actual === max}
                    numero={max}
                    onClick={cambiarPagina}>
                    {max}
                </Elemento>
            </>}
        </ul>
    );


}

const Elemento = (props) => {

    let className = 'page-item ' +
        (props.disabled ? 'disabled' : '') +
        (props.activo ? 'active' : '');

    let linkStyle = {
        height: '40px'
    }


    let callback = () => { }
    if (!props.disabled && !props.active) {
        linkStyle.cursor = 'pointer'
        callback = () => { props.onClick(props.numero) }
    }

    return (<li className={className}>
        <span className="page-link text-center" role="button" style={linkStyle} onClick={callback}>
            {props.children}
        </span>
    </li>)
}

const Elipsis = (props) => {
    return <Elemento disabled><AiOutlineEllipsis size={20} style={{ paddingBottom: '0px' }} /></Elemento>
}
/*
const UltimoElemento = (props) => {
    return <Elemento {...props}><FiChevronsRight size={20} style={{ paddingBottom: '1px' }} /></Elemento>
}

const PrimerElemento = (props) => {
    return <Elemento {...props}><FiChevronsLeft size={20} style={{ paddingBottom: '1px' }} /></Elemento>
}

const SiguienteElemento = (props) => {
    return <Elemento {...props}><FiChevronRight size={20} style={{ paddingBottom: '1px' }} /></Elemento>
}

const AnteriorElemento = (props) => {
    return <Elemento {...props}><FiChevronLeft size={20} style={{ paddingBottom: '1px' }} /></Elemento>
}
*/


export default MenuPaginacion;