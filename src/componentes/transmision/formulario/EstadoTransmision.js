import K from 'K';
import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { Form, Row, Col } from 'react-bootstrap';
import Icono from 'componentes/icono/Icono';
import { FaLongArrowAltRight } from 'react-icons/fa';


const OPCIONES_SELECT = [

]


Object.values(K.ESTADOS_TRANSMISION).forEach(tipo => {
    if (tipo.filtrable)
        OPCIONES_SELECT.push( { value: tipo.codigo, label: tipo.titulo} );
    
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
            let datosEstado = K.ESTADOS_TRANSMISION[tipo];
            return { value: datosEstado.codigo, label: datosEstado.titulo}
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
            <Form.Label column md="4">
                Estado de la transmisión
                {(values.selectedOption && values.selectedOption.length > 0) && <Icono icono={FaLongArrowAltRight} class="float-left float-md-right mr-3 mr-md-0 text-success" />}
            </Form.Label>
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