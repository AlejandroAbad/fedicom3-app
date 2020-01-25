import K from 'K'
import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Button, OverlayTrigger, Popover } from 'react-bootstrap'
import { FaLongArrowAltRight } from 'react-icons/fa'
import Icono from 'componentes/icono/Icono'
import clone from 'clone';



const Flags = ({ setValue, filtro, register, errors, ...props }) => {

    let valoresInciciales = (filtro && filtro['@flags']) ? filtro['@flags'] : {}

    const [valores, setValores] = useState(valoresInciciales);

    const cambiarFlag = (codigoFlag) => {
        let valoresNuevos = clone(valores)

        if (valoresNuevos[codigoFlag]) {
            delete valoresNuevos[codigoFlag]
        } else {
            valoresNuevos[codigoFlag] = true
        }

        setValores(valoresNuevos)
    }

    useEffect(() => {
        register({ name: '@flags' })
    }, [register])

    useEffect(() => {
        if (Object.keys(valores).length)
            setValue('@flags', valores)
        else
            setValue('@flags', null)
    }, [valores, setValue])



    let flagCheckboxes = []
    let index = 0
    for (let flag in K.FLAGS) {
        flagCheckboxes.push(<FlagCheckbox key={index++} codigo={flag} onCambiado={cambiarFlag} activo={valores[flag] ?? false} />)
    }


    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">
                Flags
                {(Object.keys(valores).length > 0) && <Icono icono={FaLongArrowAltRight} class="float-left float-md-right mr-3 mr-md-0 text-success" />}
            </Form.Label>
            <Col md="8" >
                {flagCheckboxes}
            </Col>
            {/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            </Form.Label>*/}
        </Form.Group>
    )
}



const FlagCheckbox = ({ activo, codigo, onCambiado }) => {

    let f = K.FLAGS[codigo];
    let variante = (activo ? '' : 'outline-') + f.variante

    return (
        <OverlayTrigger trigger="hover" overlay={FlagPopover(f.icono, f.titulo, f.descripcion, f.variante)} placement="bottom">
            <Button size="sm" variant={variante} className="py-0 pl-1 pr-2 mr-1" onClick={() => onCambiado(codigo)}>
                <Icono icono={f.icono} posicion={[20, 2]} className="mr-1" />
                {f.titulo}
            </Button>
        </OverlayTrigger>
    )

}

const FlagPopover = (icono, titulo, descripcion, variante) => {

    let iconComponent = icono ? <Icono icono={icono} posicion={[14]} className="mb-1 mr-1" /> : null
    let className = 'border border-' + variante

    return (
        <Popover className={className}>
            <Popover.Title as="h3" variant={variante}>
                {iconComponent}{titulo}
            </Popover.Title>
            <Popover.Content>
                {descripcion}
            </Popover.Content>
        </Popover>
    )
}


Flags.expandirOpciones = (filtro) => {
    if (filtro && filtro['@flags']) {

        for (let flag in filtro['@flags']) {
            filtro['flags.' + flag] = true
        }
    }
}

export default Flags