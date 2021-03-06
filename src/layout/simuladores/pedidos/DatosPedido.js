import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap'

import Icono from 'componentes/icono/Icono'
import { FiChevronsRight, FiChevronsDown } from 'react-icons/fi'

import DatePicker, { registerLocale } from 'react-datepicker'
import useStateLocalStorage from 'util/useStateLocalStorage'
import { FaRegCalendarTimes } from 'react-icons/fa'
import LineasPedido from './LineasPedido'
import es from 'date-fns/locale/es';
registerLocale('es-ES', es)

const DatosPedido = (props) => {
	const { watch } = props

	let dominio = watch('auth.dominio')


	return (
		<Row>
			<Col xs={12}>
				<DatosBasicosPedido {...props} />
			</Col>
			{(dominio === 'transfer_laboratorio') &&
				<Col xs={12}>
					<DatosExtraTransfer {...props} />
				</Col>
			}
			<Col xs={12}>
				<DatosExtraPedido {...props} />
			</Col>
			<Col xs={12}>
				<LineasPedido {...props} />
			</Col>
		</Row>

	)
}

const getNotaCodigoCliente = (dominio) => {
	switch (dominio) {
		case 'FEDICOM': return 'Los programas de farmacia utilizan códigos de cliente cortos (p.e: 117, 4607)'
		case 'transfer_laboratorio': return 'Los laboratorios utilizan códigos de cliente cortos (p.e: 117, 4607)'
		case 'empleado': return 'La APP del empleado utiliza el código del empleado precedido de 001990 (p.e: 0019909710, 0019901578)'
		case 'FMAS': return 'Los pedidos de FMAS se realizan con los códigos de cliente completos de 10 dígitos (p.e: 0010101879)'
		default:
			return null;
	}
}

const DatosBasicosPedido = ({ watch, setValue, register, /*errors,*/ valorActual }) => {


	let dominio = watch('auth.dominio')


	let codigoClienteInicial = valorActual?.codigoCliente ?? ""
	let tipoPedidoInicial = valorActual?.tipoPedido ?? ""
	let almacenInicial = valorActual?.almacen ?? ""

	const [codigoCliente, setCodigoCliente] = useState(codigoClienteInicial)
	const [tipoPedido, setTipoPedido] = useState(tipoPedidoInicial)
	const [almacen, setAlmacen] = useState(almacenInicial)

	let notaCodigoCliente = getNotaCodigoCliente(dominio)




	useEffect(() => {
		register({ name: 'codigoCliente' })
		register({ name: 'tipoPedido' })
		register({ name: 'codigoAlmacenServicio' })
	}, [register])

	useEffect(() => {
		setValue('codigoCliente', codigoCliente)
		setValue('tipoPedido', tipoPedido)
		setValue('codigoAlmacenServicio', almacen)
	}, [codigoCliente, tipoPedido, almacen, setValue])

	return (<>
		<Form.Group as={Row} className="align-items-center">
			<Form.Label column md={4} lg={3}>
				Código de cliente
			</Form.Label>
			<Col md={4} lg={3}>
				<Form.Control size="sm" type="text" className="text-center" defaultValue={codigoCliente} onBlur={e => setCodigoCliente(e.target.value)} />
			</Col>
			{notaCodigoCliente &&
			 <Form.Label column xs={12} className="text-muted px-3 pt-0 mt-0">
				<small>Nota: {notaCodigoCliente}</small>
			</Form.Label>}
		</Form.Group>
		<Form.Group as={Row} className="align-items-center">
			<Form.Label column md={4} lg={3}>
				Tipo de pedido
			</Form.Label>
			<Col md={3} lg={2}>
				<Form.Control size="sm" type="text" className="text-center" defaultValue={tipoPedido} onBlur={e => setTipoPedido(e.target.value)} />
			</Col>
			{/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            </Form.Label>*/}
		</Form.Group>
		<Form.Group as={Row} className="align-items-center">
			<Form.Label column md={4} lg={3}>
				Almacén de servicio
			</Form.Label>
			<Col md={3} lg={2}>
				<Form.Control type="text" size="sm" className="text-center" defaultValue={almacen} onBlur={e => setAlmacen(e.target.value)} />
			</Col>
			{/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            </Form.Label>*/}
		</Form.Group>
	</>
	)

}

const DatosExtraPedido = ({ setValue, register, /*errors,*/ valorActual }) => {


	let fechaServicioInicial = valorActual?.fechaServicio ? new Date(valorActual?.fechaServicio) : null
	let direccionEnvioInicial = valorActual?.direccionEnvio ?? ""
	let observacionesInicial = valorActual?.observaciones ?? ""

	const [fechaServicio, setFechaServicio] = useState(fechaServicioInicial)
	const [direccionEnvio, setDireccionEnvio] = useState(direccionEnvioInicial)
	const [observaciones, setObservaciones] = useState(observacionesInicial)

	const [mostrar, setMostrar] = useStateLocalStorage('simulador.pedidos.extraShow', false)


	useEffect(() => {
		register({ name: 'fechaServicio' })
		register({ name: 'direccionEnvio' })
		register({ name: 'observaciones' })
	}, [register])

	useEffect(() => {
		setValue('fechaServicio', fechaServicio)
		setValue('direccionEnvio', direccionEnvio)
		setValue('observaciones', observaciones)
	}, [fechaServicio, direccionEnvio, observaciones, setValue])

	return (<>
		<Row style={{ cursor: 'pointer' }}>
			<Col className="h6 d-inline mt-4 pt-1 bg-secondary-soft" onClick={() => setMostrar(!mostrar)}>
				<Icono icono={mostrar ? FiChevronsRight : FiChevronsDown} posicion={[22, 4]} className="text-secondary mr-2" /> Datos extra del pedido
			</Col>
		</Row>
		<div style={{ display: mostrar ? 'block' : 'none' }}>
			<Form.Group as={Row} className="align-items-center">
				<Form.Label column md={4} lg={3}>
					Fecha de servicio
				</Form.Label>
				<Col md={8} lg={9}>
					<InputGroup className="my-2">

						<DatePicker
							selected={fechaServicio}
							onChange={setFechaServicio}
							minDate={new Date()}
							timeInputLabel="Hora inicio"
							customInput={<Form.Control type="text" className="text-center" size="sm" />}
							locale={es}
							dateFormat="dd/MM/yyyy HH:mm"
							showTimeInput
							strictParsing
							shouldCloseOnSelect={true}
						/>
						<InputGroup.Append>
							<Button size="sm" variant="outline-danger" onClick={() => setFechaServicio(null)}>
								<Icono icono={FaRegCalendarTimes} posicion={[18, 4]} /> Limpiar
							</Button>
						</InputGroup.Append>
					</InputGroup>
				</Col>
				<Form.Label column className="px-3 pt-0 mt-0 text-muted">
					<small>Fecha para la que se solicita el servicio. (No servir antes)</small>
				</Form.Label>
			</Form.Group>

			<Form.Group as={Row} className="align-items-center">
				<Form.Label column md={4} lg={3}>
					Dirección de envío
			</Form.Label>
				<Col md={8} lg={9}>
					<Form.Control size="sm" type="text" defaultValue={direccionEnvio} onBlur={(e) => setDireccionEnvio(e.target.value)} />
				</Col>
				{/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            </Form.Label>*/}
			</Form.Group>
			<Form.Group as={Row} className="align-items-center">
				<Form.Label column md={4} lg={3}>
					Observaciones
			</Form.Label>
				<Col md={8} lg={9}>
					<Form.Control size="sm" type="text" defaultValue={observaciones} onBlur={(e) => setObservaciones(e.target.value)} />
				</Col>
				{/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            </Form.Label>*/}
			</Form.Group>
		</div>
	</>
	)


}

const DatosExtraTransfer = ({ setValue, register, /*errors,*/ valorActual }) => {

	let aplazamientoInicial = valorActual?.aplazamiento ?? ""

	const [aplazamiento, setAplazamiento] = useState(aplazamientoInicial)

	useEffect(() => {
		register({ name: 'aplazamiento' })
	}, [register])

	useEffect(() => {
		setValue('aplazamiento', aplazamiento)
	}, [aplazamiento, setValue])

	return (<>

		<Form.Group as={Row} className="align-items-center">
			<Form.Label column md={4} lg={3}>
				Aplazamiento de cargo
				</Form.Label>
			<Col md={4} lg={2}>
				<Form.Control size="sm" type="text" className="text-center" defaultValue={aplazamiento} onBlur={(e) => setAplazamiento(e.target.value)} />
			</Col>
			<Form.Label column className="px-3 pt-0 mt-0 text-muted">
				<small>Días que se aplaza el cargo.</small>
			</Form.Label>
		</Form.Group>

	</>
	)


}



export default DatosPedido