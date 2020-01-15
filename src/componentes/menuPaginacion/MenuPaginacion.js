import React, { useState } from 'react';
import { FiFilter, FiChevronsRight, FiChevronsLeft, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { AiOutlineEllipsis } from 'react-icons/ai';

const MenuPaginacion = (props) => {

    let min = 1;
    let max = 6;
    const [actual, setActual] = useState(min);

    let distanciaInicio = actual - min;
    let distanciaFin = max - actual;

    console.log([distanciaInicio, distanciaFin]);

    let intermedios = [];
    let elipsisInicio = false;
    let elipsisFin = false;


    intermedios[5] = actual;


    let elementosIntermedios = []
    intermedios.forEach(numero => {
        if (numero) {
            elementosIntermedios.push(<Elemento
                key={numero}
                activo={numero === actual}
                numero={numero}
                onClick={setActual}>
                {numero}
            </Elemento>)
        }
    })


    return (
        <ul className="pagination">
            {elipsisInicio && <> 
                <Elemento
                    key={min}
                    activo={actual === min}
                    numero={min}
                    onClick={setActual}>
                        {min}
                </Elemento>
                <Elipsis />
            </>}

            {elementosIntermedios}

            {elipsisFin && <> 
                <Elipsis />
                <Elemento
                    key={max}
                    activo={actual === max}
                    numero={max}
                    onClick={setActual}>
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
        lineHeight: '24px',
        width: '46px'
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
    return <Elemento disabled><AiOutlineEllipsis size={20} style={{ paddingBottom: '1px' }} /></Elemento>
}

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


export default MenuPaginacion;