import React, { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable'
import { Form, Row, Col } from 'react-bootstrap'
import { FaLongArrowAltRight } from 'react-icons/fa'
import Icono from 'componentes/icono/Icono';

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


const exprimeValores = (valorSelect) => {

    let valores = [];
    valorSelect.forEach(valor => {
        if (!valor.error) {
            valores.push(valor.value)
        }
    })
    return valores
}

const InputMolon = ({ titulo, rutaFiltro, regexSplit, regexValidate, filtro, setValue, register, errors, ...props }) => {

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




    const [estado, setEstado] = useState( opcionesIniciales )
    const [inputValue, setInputValue] = useState('')


    const handleChange = (value, actionMeta) => {
        setEstado(value)
    }

    const handleInputChange = (inputValue) => {
        setInputValue(inputValue)
    }

    const handleKeyDown = (event) => {
        if (!inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
            case ' ':
                let opcionesActuales = estado || []
                let opcionesNuevas = trocearInputAOpciones(inputValue, regexSplit);

                let valores = [...new Set([...opcionesAValores(opcionesActuales), ...opcionesAValores(opcionesNuevas)])];

                let nuevoEstado = valoresAOpciones(valores, regexValidate);
                
                setEstado(nuevoEstado)
                setInputValue('')
                event.preventDefault()
                break;
            default:
        }
    };

    const handleBlur = (event) => {
        if (event.target.value) {
            let opcionesActuales = estado || []
            let opcionesNuevas = trocearInputAOpciones(event.target.value, regexSplit);

            let valores = [...new Set([...opcionesAValores(opcionesActuales), ...opcionesAValores(opcionesNuevas)])];
            
            let nuevoEstado = valoresAOpciones(valores, regexValidate)
            
            setEstado(nuevoEstado)
            setInputValue('')
            //setValue(nombre, nuevoEstado)
            event.preventDefault()
            
        }
    }

    useEffect(() => {
        register({ name: rutaFiltro.replace(/\./g,'_DOT_') })
    }, [register, rutaFiltro])

    useEffect( () => {
        if (estado && estado.length) {
            setValue(rutaFiltro.replace(/\./g, '_DOT_'), { $in: exprimeValores(estado) })
        }
        else {
            setValue(rutaFiltro.replace(/\./g, '_DOT_'), null)
        }
    }, [setValue, rutaFiltro, estado])

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">
                {titulo} 
                {(estado && estado.length > 0) && <Icono icono={FaLongArrowAltRight} class="float-right text-success" />}
            </Form.Label>
            <Col md="8" >
                
                <CreatableSelect
                    components={{ DropdownIndicator: null }}
                    inputValue={inputValue}
                    isClearable
                    isMulti
                    menuIsOpen={false}
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder=""
                    value={estado}
                    //className={nombre}
                    //name={nombre}
                    styles={colourStyles}
                />
            </Col>
            {/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            </Form.Label>*/}
        </Form.Group>
    )
}

export default InputMolon