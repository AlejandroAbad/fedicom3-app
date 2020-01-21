import React, { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable';
import { Form, Row, Col } from 'react-bootstrap';

const colourStyles = {
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: (data.error ? '#f8d7da' : '#d4edda'),
        }
    },
    multiValueLabel: (styles, { data }) => {
        return {
            ...styles,
            color: (data.error ? '#721c24' : '#155724'),
        }
    },
    multiValueRemove: (styles, { data }) => {
        return {
            ...styles,
            color: (data.error ? '#721c24' : '#155724'),
            ':hover': {
                backgroundColor: (data.error ? '#721c24' : '#155724'),
                color: 'white',
            }
        }
    }
};

const InputMolon = ({ nombre, titulo, rutaFiltro, regexSplit, regexValidate, filtro, setValue, register, errors, ...props }) => {

    const trocearInputAOpciones = (label, regex) => {
        if (!label) return []

        let opciones = [];
        if (regex) {
            label.split(/[\s\r\n,.-]+/).forEach(tag => {
                tag = tag.trim();
                if (tag)
                    opciones.push({ label: tag, value: tag })
            })
        } else {
            opciones.push({ label: label, value: label })
        }
        return opciones
    }

    const opcionesAValores = (options) => {
        return options.map(opt => opt.value)
    }

    const valoresAOpciones = (values, regex) => {
        let opciones = []
        values.forEach(val => {
            if (val) {
                let ok = (regex) ? val.match(regex) : true;
                opciones.push({ label: val, value: val, error: !ok })
            }
        })
        return opciones
    }

    let opcionesIniciales = [];
    if (filtro && filtro[rutaFiltro] && filtro[rutaFiltro].$in) {
        opcionesIniciales = valoresAOpciones(filtro[rutaFiltro].$in, regexValidate);
    }

 


    const [estado, setEstado] = useState({ inputValue: '', value: opcionesIniciales })


    const handleChange = (value, actionMeta) => {
        setValue(nombre, value)
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
                let opcionesActuales = estado.value || []
                let opcionesNuevas = trocearInputAOpciones(estado.inputValue, regexSplit);

                let valores = [...new Set([...opcionesAValores(opcionesActuales), ...opcionesAValores(opcionesNuevas)])];

                let nuevoEstado = {
                    inputValue: '',
                    value: valoresAOpciones(valores, regexValidate)
                }

                setEstado(nuevoEstado)
                setValue(nombre, nuevoEstado.value)
                event.preventDefault();
                break;
            default: 
        }
    };

    useEffect(() => {
        register({ name: nombre })
        setValue(nombre, estado.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [register])

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">{titulo}</Form.Label>
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
                    className={nombre}
                    name={nombre}
                    styles={colourStyles}
                />
            </Col>
            {/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            </Form.Label>*/}
        </Form.Group>
    )
}

export default InputMolon