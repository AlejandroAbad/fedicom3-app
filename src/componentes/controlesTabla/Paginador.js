import React from 'react'
import { AiOutlineEllipsis } from 'react-icons/ai'
import BotonControl from './BotonControl'


const Paginador = ({ min, max, actual, onPaginaCambiada, className, ...props }) => {

    const cambiarPagina = (pagina) => {
        if (onPaginaCambiada)
            onPaginaCambiada(pagina)
    }

    let intermedios = []
    let elipsisInicio = false
    let elipsisFin = false
    let posMin, posActual, posMax

    for (let i = -4; i <= 4; i++) {
        let valor = actual + i
        let pos = 4 + i
        intermedios[pos] = (valor >= min && valor <= max) ? valor : 0
        if (valor === actual) posActual = pos
        if (valor === min) posMin = pos
        if (valor === max) posMax = pos
    }

    let distanciaInicio = posMin ? posActual - posMin : 4
    let distanciaFin = posMax ? posMax - posActual : 4

    let elementosPreservadosInicio = (distanciaInicio > 3) ? Math.max(2, 5 - distanciaFin) : 4
    let elementosPreservadosFin = (distanciaFin > 3) ? Math.max(2, 5 - distanciaInicio) : 4

    for (let i = posActual - elementosPreservadosInicio; i >= 0; i--) intermedios[i] = 0
    for (let i = posActual + elementosPreservadosFin; i < intermedios.length; i++) intermedios[i] = 0


    elipsisFin = (distanciaFin > 3 && max !== 5)
    elipsisInicio = (distanciaInicio > 3 && max !== 5)

    let botones = []
    intermedios.forEach(numero => {
        if (numero) {
            botones.push(
                <BotonControl key={numero} activo={numero === actual} numero={numero} onClick={cambiarPagina} />
            )
        }
    })

    className += ' GrupoBotones'
    return (
        <ul {...props} className={className}>
            {elipsisInicio && <>
                <BotonControl key={min} activo={actual === min} numero={min} onClick={cambiarPagina} />
                {max > 7 && <Elipsis />}
                {max === 7 && <BotonControl key={min + 1} activo={actual === min + 1} numero={min + 1} onClick={cambiarPagina} />}
            </>}

            {botones}

            {elipsisFin && <>
                {max > 7 && <Elipsis />}
                {max === 7 && <BotonControl key={max - 1} activo={actual === max - 1} numero={max - 1} onClick={cambiarPagina} />}
                <BotonControl key={max} activo={actual === max} numero={max} onClick={cambiarPagina} />
            </>}
        </ul>
    );
}


const Elipsis = ({ deshabilitado, ...props }) => {
    return <BotonControl icono={AiOutlineEllipsis} deshabilitado={deshabilitado || true} {...props} />
}


export default Paginador;