import K from 'K';
import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { Form, Row, Col } from 'react-bootstrap';
import Icono from 'componentes/icono/Icono';
import { FaLongArrowAltRight } from 'react-icons/fa';


const OPCIONES_SELECT = [
    {
        label: 'Autenticacion',
        options: []
    },
    {
        label: 'Pedidos',
        options: []
    },
    {
        label: 'Devoluciones',
        options: []
    },
    {
        label: 'Otros',
        options: []
    }
]


Object.values(K.TIPOS_TRANSMISION).forEach(tipo => {
    if (! tipo.filtrable) return;
    let idx = 3;
    if (tipo.codigo === 0)
        idx = 0
    else if (tipo.codigo < 20)
        idx = 1
    else if (tipo.codigo < 30)
        idx = 2
        
    OPCIONES_SELECT[idx].options.push({ value: tipo.codigo, label: tipo.titulo} );
    
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

const TipoTransmision = ({ setValue, filtro, register, errors, ...props }) => {

    let opcionesIniciales = [];

    if (filtro?.type?.$in) {
        opcionesIniciales = filtro.type.$in.map( tipo => {
            let datosTipo = K.TIPOS_TRANSMISION[tipo];
            return { value: datosTipo.codigo, label: datosTipo.titulo }
        })
    }

    const [values, setReactSelectValue] = useState({ selectedOption: opcionesIniciales });

    const handleMultiChange = selectedOption => {
        setReactSelectValue({ selectedOption })
    }

    useEffect(() => {
        register({ name: "type" })
    }, [register])

    useEffect(() => {
        if (values?.selectedOption?.length) 
            setValue("type", { $in: exprimeValores(values.selectedOption) } )
        else 
            setValue("type", null)
    }, [values, setValue])

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">
                Tipo de transmisión
                {(values.selectedOption && values.selectedOption.length > 0) && <Icono icono={FaLongArrowAltRight} className="float-left float-md-right mr-3 mr-md-0 text-success" />}
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

export default TipoTransmision