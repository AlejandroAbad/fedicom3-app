import K from 'K';
import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { Form, Row, Col } from 'react-bootstrap';
import Icono from 'componentes/icono/Icono';
import { FaLongArrowAltRight } from 'react-icons/fa';


const OPCIONES_SELECT = [
    { // 0
        label: 'Autenticacion',
        options: []
    },
    { // 1
        label: 'Pedidos',
        options: []
    },
    { // 2
        label: 'Devoluciones',
        options: []
    },
    { // 3
        label: 'Logística',
        options: []
    },
    { // 4
        label: 'Albaranes y facturas',
        options: []
    },
    { // 5
        label: 'Otros',
        options: []
    }
]


Object.values(K.TIPOS_TRANSMISION).forEach(tipo => {
    if (! tipo.filtrable) return;

    let idx;
    if (tipo.codigo < 10) // Codigos de 10 a 19 son del grupo PEDIDOS
        idx = 0
    else if (tipo.codigo >= 10 && tipo.codigo < 20) // Codigos de 10 a 19 son del grupo PEDIDOS
        idx = 1
    else if (tipo.codigo >= 20 && tipo.codigo < 30) // Codigos de 20 a 29 son del grupo DEVOLUCIONES
        idx = 2
    else if (tipo.codigo >= 30 && tipo.codigo < 50) // Codigos de 30 a 49 son del grupo ALBARANES Y FACTURAS
        idx = 4
    else if (tipo.codigo >= 50 && tipo.codigo < 60) // Codigos de 50 a 60 son del grupo LOGISTICA
        idx = 3
    else
        idx = 5;
        
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