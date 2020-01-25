import K from 'K';
import React, { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable';
import { Form, Row, Col, Badge } from 'react-bootstrap';
import Icono from 'componentes/icono/Icono';
import { FaLongArrowAltRight } from 'react-icons/fa';


const OPCIONES_SELECT = []

Object.values(K.PROGRAMAS_FARMACIA).forEach(programa => {
    if (programa.filtrable)
        OPCIONES_SELECT.push({ value: programa.codigo, label: programa.nombre });
})

const exprimeValores = (valorSelect) => {

    let valores = [];
    valorSelect.forEach(valor => {
        if (!valor.error) {
            valores.push(valor.value)
        }
    })
    return valores
}

const RUTA_FILTRO = 'clientRequest.headers.software-id'
const RUTA_FILTRO_DOT = RUTA_FILTRO.replace(/\./g, '_DOT_')

const SoftwareEmisor = ({ setValue, filtro, register, errors, ...props }) => {

    let opcionesIniciales = [];

    if (filtro[RUTA_FILTRO]?.$in) {
        opcionesIniciales = filtro[RUTA_FILTRO].$in.map(codigoPrograma => {
            let datosPrograma = K.PROGRAMAS_FARMACIA[parseInt(codigoPrograma)];
            if (datosPrograma)
                return { value: datosPrograma.codigo, label: datosPrograma.nombre }
            else 
                return { value: codigoPrograma, label: codigoPrograma }
        })
    }

    const [values, setReactSelectValue] = useState({ selectedOption: opcionesIniciales });

    const handleMultiChange = selectedOption => {
        setReactSelectValue({ selectedOption })
    }

    useEffect(() => {
        register({ name: RUTA_FILTRO_DOT })
    }, [register])

    useEffect(() => {
        if (values?.selectedOption?.length)
            setValue(RUTA_FILTRO_DOT, { $in: exprimeValores(values.selectedOption) })
        else
            setValue(RUTA_FILTRO_DOT, null)
    }, [values, setValue])

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">
                Programa de farmacia
                {(values.selectedOption && values.selectedOption.length > 0) && <Icono icono={FaLongArrowAltRight} class="float-left float-md-right mr-3 mr-md-0 text-success" />}
            </Form.Label>
            <Col md="8">
                <CreatableSelect
                    isMulti
                    defaultValue={values.selectedOption}
                    options={OPCIONES_SELECT}
                    onChange={handleMultiChange}
                    placeholder=""
                    formatCreateLabel={(input) => <>Añadir <h5 className="d-inline"><Badge variant='secondary' className="">{input}</Badge></h5> a la lista</> }
                />
            </Col>
        </Form.Group>
    )
}

export default SoftwareEmisor