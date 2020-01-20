import K from 'K';
import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { Form, Row, Col } from 'react-bootstrap';


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


Object.values(K.TIPOS_TRANSFERENCIA).forEach(tipo => {
    let idx = 3;
    if (tipo[0] === 0)
        idx = 0
    else if (tipo[0] < 20)
        idx = 1
    else if (tipo[0] < 30)
        idx = 2
        
    OPCIONES_SELECT[idx].options.push( { value: tipo[0], label: tipo[1]} );
    
})

const TipoTransmision = ({ setValue, filtro, register, errors, ...props }) => {

    let opcionesIniciales = [];

    if (filtro && filtro.type && filtro.type.$in) {
        opcionesIniciales = filtro.type.$in.map( tipo => {
            let datosTipo = K.TIPOS_TRANSFERENCIA[tipo];
            return { value: datosTipo[0], label: datosTipo[1] }
        })
    }

    const [values, setReactSelectValue] = useState({ selectedOption: opcionesIniciales });

    const handleMultiChange = selectedOption => {
        console.log(selectedOption)
        setValue("tipoTx", selectedOption);
        setReactSelectValue({ selectedOption });
    }

    useEffect(() => {
        register({ name: "tipoTx" }); // custom register react-select 
    }, [register])

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">Tipo de transmisión</Form.Label>
            <Col md="8">
                <Select 
                    isMulti 
                    defaultValue={values.selectedOption}
                    options={OPCIONES_SELECT}
                    onChange={handleMultiChange}
                    className="tipoTx"
                    name="tipoTx"
                    placeholder="Seleccione tipos de transmisión"
                />
            </Col>
        </Form.Group>
    )
}

export default TipoTransmision