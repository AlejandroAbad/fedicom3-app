import React, { useState, useEffect, useRef } from 'react'
import clone from 'clone'
import Icono from 'componentes/icono/Icono'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { GoPlus, GoTrashcan } from 'react-icons/go'


const LineasDevolucion = (props) => {
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

	const lineaActualizada = (posicion, nuevaLinea) => {
		let nuevasLineas = clone(lineas)
		nuevasLineas[posicion] = nuevaLinea
		setLineas(nuevasLineas)
	}

	return <>
		
		<h5 className="mt-2">Posiciones</h5>
		
		<CreadorLineas onLineaCreada={agregarLinea} />
		{lineas.length > 0 ?
			lineas.map((linea, i) => { return (<Linea key={i} linea={linea} posicion={i} onEliminar={eliminarLinea} onActualizar={lineaActualizada} />) })
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
				<Col sm={3} md={1} lg={1} className="text-center">
					<small>codigoMotivo</small>
				</Col>
				<Col sm={6} md={3} lg={2} className="text-center">
					<small>Artículo</small>
				</Col>
				<Col sm={3} md={2} lg={2} className="text-center">
					<small>Cantidad</small>
				</Col>
				<Col sm={3} md={2} lg={2} className="text-center">
					<small>numeroAlbaran</small>
				</Col>
				<Col sm={6} md={3} lg={2} className="text-center">
					<small>fechaAlbaran</small>
				</Col>
				<Col sm={3} md={1} lg={2} className="text-center">
					<small>lote</small>
				</Col>
				<Col sm={3} md={1} lg={1} className="text-center">
					<small>fechaCaducidad</small>
				</Col>
				<Col sm={3} md={1} lg={1} className="text-center">
					<small>estupe</small>
				</Col>


			</Row>

			<Row className="border rounded-bottom pb-1 pt-2 pl-2 no-gutters bg-success-soft">

				<Col sm={3} md={1} lg={2}>
					<Form.Control name="codigoMotivo" size="sm" type="text" placeholder="codigoMotivo" className="text-center" ref={register} />
				</Col>
				<Col sm={6} md={3} lg={2}>
					<Form.Control name="codigoArticulo" size="sm" type="text" placeholder="codigoArticulo" className="text-center" ref={register} />
				</Col>
				<Col sm={3} md={2} lg={2}>
					<Form.Control name="cantidad" size="sm" type="text" placeholder="cantidad" className="text-center" ref={register} />
				</Col>
				<Col sm={3} md={2} lg={2}>
					<Form.Control name="numeroAlbaran" size="sm" type="text" placeholder="numeroAlbaran" className="text-center" ref={register} />
				</Col>
				<Col sm={6} md={3} lg={2}>
					<Form.Control name="fechaAlbaran" size="sm" type="text" placeholder="fechaAlbaran" className="text-center" ref={register} />
				</Col>
				<Col sm={3} md={1} lg={2}>
					<Form.Control name="lote" size="sm" type="text" placeholder="lote" className="text-center" ref={register} />
				</Col>
				<Col sm={3} md={1} lg={2}>
					<Form.Control name="fechaCaducidad" size="sm" type="text" placeholder="fechaCaducidad" className="text-center" ref={register} />
				</Col>
				<Col sm={3} md={1} lg={2}>
					<Form.Control name="valeEstupefaciente" size="sm" type="text" placeholder="valeEstupefaciente" className="text-center" ref={register} />
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


const Linea = ({ linea, posicion, onEliminar, onActualizar }) => {

	const refCodigoMotivo = useRef()
	const refCodigoArticulo = useRef()
	const refCantidad = useRef()
	const refNumeroAlbaran = useRef()
	
	const refFechaAlbaran = useRef()
	const refLote = useRef()
	const refFechaCaducidad = useRef()

	const refValeEstupefaciente = useRef()

	const actualizar = (e) => {
		
		let nuevosDatos = {
			codigoMotivo: refCodigoMotivo.current.value,
			codigoArticulo: refCodigoArticulo.current.value,
			cantidad: refCantidad.current.value,
			numeroAlbaran: refNumeroAlbaran.current.value,
			fechaAlbaran: refFechaAlbaran.current.value,
			lote: refLote.current.value,
			fechaCaducidad: refFechaCaducidad.current.value,
			valeEstupefaciente: refValeEstupefaciente.current.value
		}

		onActualizar(posicion, nuevosDatos)
		
	}

	return (
		<Row className="border rounded-bottom pb-1 pt-2 pl-2 no-gutters">
			<Col sm={6} md={3} lg={2}>
				<Form.Control defaultValue={linea.codigoMotivo} ref={refCodigoMotivo} size="sm" type="text" className="text-center" onBlur={actualizar} />
			</Col>
			<Col sm={6} md={3} lg={2}>
				<Form.Control defaultValue={linea.codigoArticulo} ref={refCodigoArticulo} size="sm" type="text" className="text-center" onBlur={actualizar} />
			</Col>
			<Col sm={3} md={2} lg={2}>
				<Form.Control defaultValue={linea.cantidad} ref={refCantidad} size="sm" type="text" className="text-center" onBlur={actualizar} />
			</Col>
			<Col sm={3} md={2} lg={2}>
				<Form.Control defaultValue={linea.numeroAlbaran} ref={refNumeroAlbaran} size="sm" type="text" className="text-center" onBlur={actualizar} />
			</Col>
			<Col sm={3} md={1} lg={2}>
				<Form.Control defaultValue={linea.fechaAlbaran} ref={refFechaAlbaran} size="sm" type="text" className="text-center" onBlur={actualizar} />
			</Col>
			<Col sm={3} md={1} lg={2}>
				<Form.Control defaultValue={linea.lote} ref={refLote} size="sm" type="text" className="text-center" onBlur={actualizar} />
			</Col>
			<Col sm={3} md={1} lg={2}>
				<Form.Control defaultValue={linea.fechaCaducidad} ref={refFechaCaducidad} size="sm" type="text" className="text-center" onBlur={actualizar} />
			</Col>
			<Col sm={6} md={3} lg={2}>
				<Form.Control defaultValue={linea.valeEstupefaciente} ref={refValeEstupefaciente} size="sm" type="text" className="text-center" onBlur={actualizar} />
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





export default LineasDevolucion