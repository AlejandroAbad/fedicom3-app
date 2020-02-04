import React, { useState, useEffect } from 'react'

import Icono from 'componentes/icono/Icono'

import { FiChevronsRight } from 'react-icons/fi'
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es';
import { FaRegCalendarTimes } from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
registerLocale('es-ES', es)





const LineasPedido = (props) => {
	const { setValue, register, /*errors,*/ valorActual } = props

	let valorInicial = valorActual?.lineas ?? []

	const [lineas, setLineas] = useState(valorInicial)

	useEffect(() => {
		register({ name: 'lineas' })
	}, [register])

	useEffect(() => {
		setValue('lineas', lineas)
	}, [lineas, setValue])


	return <>
		<Row>
			<Col className="h6 d-inline mt-4 pt-1 bg-info-soft">
				<Icono icono={FiChevronsRight} posicion={[22, 4]} className="text-secondary" /> Líneas del pedido
			</Col>
		</Row>
		<CreadorLineas />
		{lineas.map((linea, i) => <Linea key={i} linea={linea} />)}
	</>

}

const CreadorLineas = () => {


	return (
		<>
			<Row className="border rounded-top p-1 d-none d-md-flex no-gutters">
				<Col sm={6} md={3} lg={2} className="text-center">
					<small>Artículo</small>
				</Col>
				<Col sm={3} md={2} lg={2} className="text-center">
					<small>Cantidad</small>
				</Col>
				<Col sm={3} md={2} lg={2} className="text-center">
					<small>Bonificado</small>
				</Col>
				<Col sm={6} md={3} lg={2} className="text-center">
					<small>Vale estupe</small>
				</Col>
				<Col sm={3} md={1} lg={2} className="text-center">
					<small>%<span class="d-none d-lg-inline"> Descuento</span></small>
				</Col>
				<Col sm={3} md={1} lg={1} className="text-center">
					<small>Demora</small>
				</Col>

			</Row>

			<Row className="border rounded-bottom p-1 no-gutters">

				<Col sm={6} md={3} lg={2}>
					<Form.Control size="sm" type="text" placeholder="Artículo" className="text-center" />
				</Col>
				<Col sm={3} md={2} lg={2}>
					<Form.Control size="sm" type="text" placeholder="Cant." className="text-center" />
				</Col>
				<Col sm={3} md={2} lg={2}>
					<Form.Control size="sm" type="text" placeholder="Bonif." className="text-center" />
				</Col>
				<Col sm={6} md={3} lg={2}>
					<Form.Control size="sm" type="text" placeholder="Estupe" className="text-center" />
				</Col>
				<Col sm={3} md={1} lg={2}>
					<Form.Control size="sm" type="text" placeholder="%" className="text-center" />
				</Col>
				<Col sm={3} md={1} lg={1} className="text-center">
					<small>
						<Form.Check custom type="checkbox" label={<span className="d-md-none pt-2">Demorado</span>} id={`demorados`} className="pt-1" />
					</small>
				</Col>

				<Col md={12} lg={1} className="text-center  mt-2 mt-lg-0">
					<Button size="sm" variant='success'>
						<Icono icono={GoPlus} posicion={[22, 2]} />
						<span className="d-lg-none">Añadir línea</span>
					</Button>
				</Col>
			</Row>
		</>
	)

}


const Linea = (linea) => {
	return (
		<Row>
			<Col>{linea.key}</Col>
			<Col>{linea.codigoArticulo}</Col>
			<Col>{linea.cantidad}</Col>
		</Row>
	)
}





export default LineasPedido