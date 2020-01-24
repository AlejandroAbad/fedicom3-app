import React, { useState, useEffect, forwardRef } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Form, Row, Col, Button, Dropdown, ButtonGroup } from 'react-bootstrap'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { FaLongArrowAltRight } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';
import { MdDateRange } from 'react-icons/md';
registerLocale('es-ES', es)

const BotonInput = forwardRef(({ value, onClick, ...props }, ref) => {
    return (
        <Button {...props} ref={ref} variant="outline-secondary" className="mr-3" onClick={onClick}>
            {value}
        </Button>
    )
})

const MenuMomentosPredefinidos = ({ seleccionarMomento }) => (
    <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle split variant="outline-primary"  >
            <span className="pr-2"><Icono icono={MdDateRange} posicion={[20,3]} /></span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => seleccionarMomento('hoy')}>Hoy</Dropdown.Item>
            <Dropdown.Item onClick={() => seleccionarMomento('ayer')}>Ayer</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => seleccionarMomento('estaSemana')}>Esta semana</Dropdown.Item>
            <Dropdown.Item onClick={() => seleccionarMomento('semanaPasada')}>Semana pasada</Dropdown.Item>
            <Dropdown.Item onClick={() => seleccionarMomento('7dias')}>Últimos 7 días</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => seleccionarMomento('esteMes')}>Este mes</Dropdown.Item>
            <Dropdown.Item onClick={() => seleccionarMomento('mesPasado')}>Mes pasado</Dropdown.Item>
            <Dropdown.Item onClick={() => seleccionarMomento('30dias')}>Últimos 30 días</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
)

const PROPS_COMUNES = {
    locale: es,
    dateFormat: "dd/MM/yyyy HH:mm",
    selectsEnd: false,
    showTimeInput: true,
    strictParsing: true,
    highlightDates: [new Date()],
    shouldCloseOnSelect: false
}

const RangoFechas = ({ titulo, filtro, rutaFiltro, setValue, register, errors, ...props }) => {

    let fechaInicial = moment().startOf('day').toDate(), fechaFinal = moment().endOf('day').toDate()

    if (filtro?.[rutaFiltro]) {
        if (filtro[rutaFiltro].$gte) fechaInicial = new Date(filtro[rutaFiltro].$gte);
        if (filtro[rutaFiltro].$lte) fechaFinal = new Date(filtro[rutaFiltro].$lte);
    }

    const [fecha, _setFecha] = useState({ $gte: fechaInicial, $lte: fechaFinal });


    const setFechaInicio = (date) => {
        _setFecha({
            $gte: date,
            $lte: fecha.$lte
        })
    }
    const setFechaFin = (date) => {
        _setFecha({
            $gte: fecha.$gte,
            $lte: date
        })
    }
    const seleccionarMomento = (momento) => {
        let inicio, fin;
        switch (momento) {
            case 'ayer':
                inicio = moment().subtract(1, 'days').startOf('day')
                fin = moment().subtract(1, 'days').endOf('day')
                break
            case 'estaSemana':
                inicio = moment().startOf('week')
                fin = moment().endOf('week')
                break
            case 'semanaPasada':
                inicio = moment().subtract(1, 'week').startOf('week')
                fin = moment().subtract(1, 'week').endOf('week')
                break
            case '7dias':
                inicio = moment().subtract(1, 'week').startOf('day')
                fin = moment().endOf('day')
                break
            case 'esteMes':
                inicio = moment().startOf('month')
                fin = moment().endOf('month')
                break
            case 'mesPasado':
                inicio = moment().subtract(1, 'month').startOf('month')
                fin = moment().subtract(1, 'month').endOf('month')
                break
            case '30dias':
                inicio = moment().subtract(1, 'month').startOf('day')
                fin = moment().endOf('day')
                break
            default: 
                inicio = moment().startOf('day')
                fin = moment().endOf('day')
                break
        }

        _setFecha({ $gte: inicio.toDate(), $lte: fin.toDate() })
    }

    useEffect(() => {
        register({ name: rutaFiltro })
    }, [register, rutaFiltro])

    useEffect(() => {
        setValue(rutaFiltro, fecha)
    }, [fecha, setValue, rutaFiltro])

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">
                {titulo}
                <Icono icono={FaLongArrowAltRight} class="float-left float-md-right mr-3 mr-md-0 text-success" />
            </Form.Label>
            
            <Col md="8">
                <DatePicker
                    selected={fecha.$gte}
                    onChange={setFechaInicio}
                    startDate={fecha.$gte}
                    endDate={fecha.$lte}
                    maxDate={fecha.$lte}
                    customInput={<BotonInput />}
                    timeInputLabel="Hora inicio"
                    {...PROPS_COMUNES}
                />
                <DatePicker
                    selected={fecha.$lte}
                    onChange={setFechaFin}
                    startDate={fecha.$gte}
                    endDate={fecha.$lte}
                    minDate={fecha.$gte}
                    maxDate={new Date()}
                    customInput={<BotonInput />}
                    timeInputLabel="Hora fin"
                    {...PROPS_COMUNES}
                />
                <MenuMomentosPredefinidos seleccionarMomento={seleccionarMomento} />
            </Col>
            {/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            </Form.Label>*/}
        </Form.Group>
    );
}


export default RangoFechas