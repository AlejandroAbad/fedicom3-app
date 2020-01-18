import React from 'react'
import { Form } from 'react-bootstrap'

const LimitadorResultados = ({ actual, salto, max, onLimiteCambiado, ...props }) => {

    const cambiarLimiteResultados = (e) => {
        if (onLimiteCambiado)
            onLimiteCambiado(e.target.value)
    }

    let opciones = []

    if (actual < salto)
        opciones.push(<option value={actual} key={actual}>{actual}</option>)

    for (let i = salto; i <= max; i = i + salto) {
        if (i > salto && actual < i && actual > (i - salto)) {
            opciones.push(<option value={actual} key={actual}>{actual}</option>)
        }
        opciones.push(<option value={i} key={i}>{i}</option>)
    }

    if (actual > max)
        opciones.push(<option value={actual} key={actual}>{actual}</option>)

    return (
        < Form.Control as="select" size="sm" value={actual} className="w-auto d-inline-block h-auto" onChange={cambiarLimiteResultados} >
            {opciones}
        </Form.Control >
    )
}

export default LimitadorResultados