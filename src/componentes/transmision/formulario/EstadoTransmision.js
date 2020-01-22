import K from 'K';
import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { Form, Row, Col } from 'react-bootstrap';


const OPCIONES_SELECT = [

]


Object.values(K.ESTADOS_TRANSFERENCIA).forEach(tipo => {

    OPCIONES_SELECT.push( { value: tipo[0], label: tipo[1]} );
    
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

const EstadoTransmision = ({ setValue, filtro, register, errors, ...props }) => {

    let opcionesIniciales = [];

    if (filtro?.status?.$in) {
        opcionesIniciales = filtro.status.$in.map( tipo => {
            let datosEstado = K.ESTADOS_TRANSFERENCIA[tipo];
            return { value: datosEstado[0], label: datosEstado[1] }
        })
    }

    const [values, setReactSelectValue] = useState({ selectedOption: opcionesIniciales });

    const handleMultiChange = selectedOption => {
        setReactSelectValue({ selectedOption });
    }

    useEffect(() => {
        register({ name: "status" }); // custom register react-select 
    }, [register])

    useEffect(() => {
        if (values?.selectedOption?.length)
            setValue("status", { $in: exprimeValores(values.selectedOption) })
        else
            setValue("status", null)
    }, [values, setValue])

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">Estado de la transmisión</Form.Label>
            <Col md="8">
                <Select 
                    isMulti 
                    defaultValue={values.selectedOption}
                    options={OPCIONES_SELECT}
                    onChange={handleMultiChange}
                    placeholder=""
                />
            </Col>
        </Form.Group>
    )
}

export default EstadoTransmision