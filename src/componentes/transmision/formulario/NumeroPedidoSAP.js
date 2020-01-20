import React, { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable';
import { Form, Row, Col } from 'react-bootstrap';


const createOption = (label) => {
    if (!label) return []

    let r = label.split(/[\s\r\n,.-]+/).map(tag => ({ label: tag, value: tag }))
    console.log(r)
    return r

}


const NumeroPedidoSAP = ({ setValue, filtro, register, errors, ...props }) => {

    let opcionesIniciales = [];

    const [estado, setEstado] = useState({ inputValue: '', value: [] })

    const handleChange = (value, actionMeta) => {
        setValue("numerosPedidoSAP", value)
        setEstado({ inputValue: '', value })
    }

    const handleInputChange = (inputValue) => {
        setEstado({ inputValue: inputValue, value: estado.value })
    }

    const handleKeyDown = (event) => {
        if (!estado.inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
            case ' ':

                // TODO: Filtrar repes, pero 
                
                let valoresActuales = estado.value || []


                let nuevoArray = [...valoresActuales, ...createOption(estado.inputValue)];

                let nuevoEstado = {
                    inputValue: '',
                    value: nuevoArray,
                }

                setEstado(nuevoEstado)
                setValue("numerosPedidoSAP", nuevoEstado.value)
                event.preventDefault();
        }
    };

    useEffect(() => {
        register({ name: "numerosPedidoSAP" }); // custom register react-select 
    }, [register])

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">Números de pedido SAP</Form.Label>
            <Col md="8">
                <CreatableSelect
                    components={{ DropdownIndicator: null }}
                    inputValue={estado.inputValue}
                    isClearable
                    isMulti
                    menuIsOpen={false}
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder=""
                    value={estado.value}
                    className="numerosPedidoSAP"
                    name="numerosPedidoSAP"
                />
            </Col>
        </Form.Group>
    )
}

export default NumeroPedidoSAP