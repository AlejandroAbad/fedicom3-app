import React, { useState, useEffect } from 'react'
import clone from 'clone'
import Icono from 'componentes/icono/Icono'
import { FiChevronsRight } from 'react-icons/fi'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { GoPlus, GoTrashcan } from 'react-icons/go'





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

	const agregarLinea = (linea) => {
		let nuevasLineas = clone(lineas)
		nuevasLineas.push(linea)
		setLineas(nuevasLineas)
	}

	const eliminarLinea = (posicion) => {
		setLineas(lineas.filter((e, i) => (i !== posicion)))
	}

	return <>
		<CreadorLineas onLineaCreada={agregarLinea} />
		{lineas.length > 0 ?
			lineas.map((linea, i) => { return (<Linea key={i} linea={linea} posicion={i} onEliminar={eliminarLinea} />) })
			:
			<Alert variant="secondary mt-2">
				<Alert.Heading>No se han definido posiciones</Alert.Heading>
				<p>Rellene los datos en el cuadro superior y pulse "Añadir línea".</p>
			</Alert>
		}
	</>

}

const CreadorLineas = ({ onLineaCreada }) => {

	const { register, handleSubmit } = useForm()

	const crearLinea = (values) => {
		onLineaCreada(values)
	}

	return (
		<>
			<Row className="border rounded-top pb-1 pt-2 pl-2 d-none d-md-flex no-gutters">
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
					<small>%<span className="d-none d-lg-inline"> Descuento</span></small>
				</Col>
				<Col sm={3} md={1} lg={1} className="text-center">
					<small>Demora</small>
				</Col>

			</Row>

			<Row className="border rounded-bottom pb-1 pt-2 pl-2 no-gutters bg-success-soft">

				<Col sm={6} md={3} lg={2}>
					<Form.Control name="codigoArticulo" size="sm" type="text" placeholder="Artículo" className="text-center" ref={register} />
				</Col>
				<Col sm={3} md={2} lg={2}>
					<Form.Control name="cantidad" size="sm" type="text" placeholder="Cant." className="text-center" ref={register} />
				</Col>
				<Col sm={3} md={2} lg={2}>
					<Form.Control name="cantidadBonificacion" size="sm" type="text" placeholder="Bonif." className="text-center" ref={register} />
				</Col>
				<Col sm={6} md={3} lg={2}>
					<Form.Control name="valeEstupefaciente" size="sm" type="text" placeholder="Estupe" className="text-center" ref={register} />
				</Col>
				<Col sm={3} md={1} lg={2}>
					<Form.Control name="descuentoPorcentaje" size="sm" type="text" placeholder="%" className="text-center" ref={register} />
				</Col>
				<Col sm={3} md={1} lg={1} className="text-center">
					<small>
						<Form.Check custom name="servicioDemorado" type="checkbox" label={<span className="d-md-none pt-2">Demorado</span>} id={`demorados`} className="pt-1" ref={register} />
					</small>
				</Col>

				<Col md={12} lg={1} className="text-center  mt-2 mt-lg-0">
					<Button size="sm" variant='success' onClick={handleSubmit(crearLinea)}>
						<Icono icono={GoPlus} posicion={[22, 2]} />
						<span className="d-lg-none">Añadir línea</span>
					</Button>
				</Col>
			</Row>
		</>
	)

}


const Linea = ({ linea, posicion, onEliminar }) => {

	console.log(linea)
	return (
		<Row className="border rounded-bottom pb-1 pt-2 pl-2 no-gutters">

			<Col sm={6} md={3} lg={2}>
				<Form.Control value={linea.codigoArticulo} size="sm" type="text" className="text-center" onChange={() => { }} />
			</Col>
			<Col sm={3} md={2} lg={2}>
				<Form.Control value={linea.cantidad} size="sm" type="text" className="text-center" onChange={() => { }} />
			</Col>
			<Col sm={3} md={2} lg={2}>
				<Form.Control value={linea.cantidadBonificacion} size="sm" type="text" className="text-center" onChange={() => { }} />
			</Col>
			<Col sm={6} md={3} lg={2}>
				<Form.Control value={linea.valeEstupefaciente} size="sm" type="text" className="text-center" onChange={() => { }} />
			</Col>
			<Col sm={3} md={1} lg={2}>
				<Form.Control value={linea.descuentoPorcentaje} size="sm" type="text" className="text-center" onChange={() => { }} />
			</Col>
			<Col sm={3} md={1} lg={1} className="text-center">
				<small>
					<Form.Check custom disabled checked={linea.servicioDemorado} type="checkbox" label={<span className="d-md-none pt-2">Demorado</span>} id={`demorados-${posicion}`} className="pt-1" />
				</small>
			</Col>

			<Col md={12} lg={1} className="text-center  mt-2 mt-lg-0">
				<Button size="sm" variant='danger' onClick={() => onEliminar(posicion)}>
					<Icono icono={GoTrashcan} posicion={[22, 2]} />
					<span className="d-lg-none">Quitar línea</span>
				</Button>
			</Col>
		</Row>
	)
}





export default LineasPedido