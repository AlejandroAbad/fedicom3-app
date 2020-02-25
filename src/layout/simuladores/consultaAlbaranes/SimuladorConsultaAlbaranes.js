import K from 'K'
import React, { useRef, useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap"
import Icono from 'componentes/icono/Icono'
import { FaRegFilePdf, FaCode, FaSearch } from 'react-icons/fa'
import fedicomFetch, {fedicomFetchPdf} from 'util/fedicomFetch'
import ReactDatePicker from 'react-datepicker'
import ConsultaError from 'componentes/estadoConsulta/ConsultaError'
import ConsultaCargando from 'componentes/estadoConsulta/ConsultaCargando'
import ConsultaVacia from 'componentes/estadoConsulta/ConsultaVacia'
import ReactJson from 'react-json-view'
import useStateLocalStorage from 'util/useStateLocalStorage'


const SimuladorConsultaAlbaranes = ({ jwt }) => {

	const refCodigoCliente = useRef()
	const refFechaDesde = useRef()
	const refFechaHasta = useRef()
	const refNumeroAlbaran = useRef()
	const refDescargaPdf = useRef()

	const [resultado, setResultado] = useState({ cargando: false, datos: null, error: null, tipo: 'lista' })
	const [codigoCliente, setCodigoCliente] = useStateLocalStorage('qAlbaran.codigoCliente', '', false)
	const [fechaDesde, setFechaDesde] = useState(new Date())
	const [fechaHasta, setFechaHasta] = useState(new Date())


	const listarAlbaranes = () => {

		setResultado({ datos: null, error: null, cargando: true, tipo: 'lista' })

		let parametrosQuery = {
			codigoCliente: refCodigoCliente.current.value
		}

		if (refFechaDesde.current?.input?.value) parametrosQuery.fechaDesde = refFechaDesde.current.input.value
		if (refFechaHasta.current?.input?.value) parametrosQuery.fechaHasta = refFechaHasta.current.input.value
		let queryString = Object.keys(parametrosQuery).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(parametrosQuery[k])).join('&')
		fedicomFetch(K.DESTINOS.CORE + '/albaranes?' + queryString, { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ datos: response.body, error: null, cargando: false, tipo: 'lista' });
					} else {
						setResultado({ datos: null, error: response.body, cargando: false, tipo: 'lista' });
					}
				}

			})
			.catch(error => {
				setResultado({ datos: null, error, cargando: false, tipo: 'lista' });
			})
	}

	const consultaAlbaranJson = (numeroAlbaran) => {

		if (!numeroAlbaran) {
			numeroAlbaran = refNumeroAlbaran.current.value
		}

		if (!numeroAlbaran) {
			setResultado({ datos: null, error: [{ codigo: "ALB-ERR-API", descripcion: "Debes indicar el número del albarán" }], cargando: false, tipo: 'json' })
			return;
		}

		setResultado({ datos: null, error: null, cargando: true, tipo: 'json' })

		let parametrosQuery = {
			codigoCliente: refCodigoCliente.current.value
		}

		let queryString = Object.keys(parametrosQuery).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(parametrosQuery[k])).join('&')

		fedicomFetch(K.DESTINOS.CORE + '/albaranes/' + numeroAlbaran + '?' + queryString, { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ datos: response.body, error: null, cargando: false, tipo: 'json' });
					} else {
						setResultado({ datos: null, error: response.body, cargando: false, tipo: 'json' });
					}
				}

			})
			.catch(error => {
				setResultado({ datos: null, error, cargando: false, tipo: 'json' });
			})
	}

	const consultaAlbaranPdf = (numeroAlbaran) => {

		if (!numeroAlbaran) {
			numeroAlbaran = refNumeroAlbaran.current.value
		}

		if (!numeroAlbaran) {
			setResultado({ datos: null, error: [{codigo: "ALB-ERR-API", descripcion: "Debes indicar el número del albarán"}], cargando: false, tipo: 'pdf' })
			return;
		}

		setResultado({ datos: null, error: null, cargando: true, tipo: 'pdf' })

		let parametrosQuery = {
			codigoCliente: refCodigoCliente.current.value
		}

		let queryString = Object.keys(parametrosQuery).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(parametrosQuery[k])).join('&')

		fedicomFetchPdf(K.DESTINOS.CORE + '/albaranes/' + numeroAlbaran + '?' + queryString, refDescargaPdf, { method: 'GET', fileName: numeroAlbaran + '.pdf' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ datos: response.body, error: null, cargando: false, tipo: 'pdf' });
					} else {
						setResultado({ datos: null, error: [{codigo:'ERR-ALB-999', descripcion: 'No se encuentra el albarán'}], cargando: false, tipo: 'pdf' });
					}
				}

			})
			.catch(error => {
				setResultado({ datos: null, error, cargando: false, tipo: 'pdf' });
			})
	}


	let contenedorResultado = null

	if (resultado.cargando) {
		contenedorResultado = <ConsultaCargando texto={`Realizando consulta  ...`} />
	}
	else if (resultado.error) {
		contenedorResultado = <ConsultaError titulo="No se pudo obtener el albarán" errores={resultado.error} />
	}
	else if (resultado.datos && resultado.datos.length === 0) {
		contenedorResultado = <ConsultaVacia titulo="No se han encontrado albaranes" texto="Pruebe a cambiar la consulta y reintentelo" />
	} else if (resultado.datos) {
		if (resultado.tipo === 'lista') {
			contenedorResultado = <div className="mt-5">
				<h5>Resultado de la búsqueda:</h5>
				{resultado.datos.map((alb, i) => {
					return <LineaAlbaran key={i} albaran={alb} onClickJson={consultaAlbaranJson} onClickPdf={consultaAlbaranPdf} />
				})}
			</div>
		} else if (resultado.tipo === 'json') {
			contenedorResultado = <div className="mt-5">
				<h5>Resultado de la búsqueda:</h5>
				<ReactJson src={resultado.datos} name="albaran" displayObjectSize={false} displayDataTypes={false} enableClipboard={false} />
			</div>
		} else if (resultado.tipo === 'pdf') {
			contenedorResultado = <pre className="mt-5">
				<Alert variant="primary">
					<Alert.Heading>Descargando albarán ...</Alert.Heading>
					El albarán se descargará en unos instantes.
				</Alert>
			</pre>
		}
	}


	return <Container>
		<a ref={refDescargaPdf} href="/" className="d-none">as</a>

		<h4 className="border-bottom pb-2 mb-4">
			Consulta de albaranes
		</h4>

		<Row>
			<Col xs={12}>
				<Form.Group as={Row} className="align-items-center">
					<Form.Label column md={3}>
						Código de cliente
					</Form.Label>
					<Col md={6} lg={4}>
						<Form.Control size="sm" type="text" className="text-center" ref={refCodigoCliente} defaultValue={codigoCliente} onChange={(e) => setCodigoCliente(e.target.value)} />
					</Col>
					<Form.Label column xs={12} className="text-muted px-3 pt-0 mt-0">
						<small>Nota: Las consultas se realizan con el código de cliente completo (Ej. 10107506, 10101234 ...)</small>
					</Form.Label>
				</Form.Group>
			</Col>
			<Col md={6}>
				<h6 className=" mt-3 py-2 text-center bg-primary-soft">
					Listar albaranes
				</h6>

				<Form.Group as={Row} className="align-items-center px-3">
					<Form.Label column md={12} lg={6}>
						Fecha desde
					</Form.Label>
					<Col md={12} lg={6}>
						<ReactDatePicker
							ref={refFechaDesde}
							selected={fechaDesde}
							onChange={setFechaDesde}
							customInput={<Form.Control type="text" className="text-center" size="sm" />}
							dateFormat="dd/MM/yyyy"
							strictParsing
							shouldCloseOnSelect={true}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="align-items-center px-3">
					<Form.Label column md={12} lg={6}>
						Fecha hasta
					</Form.Label>
					<Col md={12} lg={6}>
						<ReactDatePicker
							ref={refFechaHasta}
							selected={fechaHasta}
							onChange={setFechaHasta}
							customInput={<Form.Control type="text" className="text-center" size="sm" />}
							dateFormat="dd/MM/yyyy"
							strictParsing
							shouldCloseOnSelect={true}
						/>
					</Col>
				</Form.Group>

				<Row>
					<Col xs={12} className="text-center">
						<Button variant='outline-primary' className="mx-1" onClick={listarAlbaranes}>
							<Icono icono={FaSearch} posicion={[22, 2]} className="mr-1" />Consultar
						</Button>
					</Col>
				</Row>

			</Col>
			<Col md={6}>

				<h6 className=" mt-3 py-2 text-center  bg-success-soft">
					Por número
				</h6>

				<Form.Group as={Row} className="align-items-center px-3">
					<Form.Label column md={12} lg={6}>
						Número de albarán
					</Form.Label>
					<Col md={12} lg={6}>
						<Form.Control size="sm" type="text" className="text-center" ref={refNumeroAlbaran} />
					</Col>
				</Form.Group>

				<Row>
					<Col xs={12} className="text-center">
						<Button variant='outline-success' className="mx-1" onClick={() => consultaAlbaranPdf()}>
							<Icono icono={FaRegFilePdf} posicion={[22, 2]} className="mr-1" />PDF
						</Button>
						<Button variant='outline-success' className="mx-1" onClick={() => consultaAlbaranJson()}>
							<Icono icono={FaCode} posicion={[22, 2]} className="mr-1" />JSON
						</Button>
					</Col>
				</Row>

			</Col>
		</Row>

		{contenedorResultado}

	</Container>

}




const LineaAlbaran = ({ albaran, onClickJson, onClickPdf }) => {

	let colorObs = 'dark'
	switch (albaran.observaciones) {
		case 'Entregado':
			colorObs = 'success'
			break;
		case 'Rechazado':
			colorObs = 'danger'
			break;
		default:
	}

	return <Row className="text-monospace no-gutters border-top pb-2 pt-3">
		<Col xs={5} sm={6} md={4}>
			<Row className="no-gutters">
				<Col xs={12} sm={6}>{albaran.numeroAlbaran}</Col>
				<Col xs={12} sm={6}>{albaran.fechaAlbaran}</Col>
			</Row>
		</Col >
		<Col xs={4} sm={4} md={3} >
			<Row className="no-gutters">
				<Col xs={12} sm={6}>{albaran.totales.precioAlbaran}€</Col>
				<Col xs={12} sm={6}>{albaran.totales.precioNeto}€</Col>
			</Row>
		</Col>
		<Col md={2} className={`d-none d-md-inline text-${colorObs}`}>{albaran.observaciones}</Col>
		<Col xs={3} sm={2} md={3}>
			<Row className="no-gutters">
				<Col xs={12} className="text-right">
					<Button variant='outline-dark' className="mx-md-1" size='sm' onClick={() => onClickPdf(albaran.numeroAlbaran)}>
						<Icono icono={FaRegFilePdf} posicion={[18, 2]} className="mr-md-1" />
						<span className="d-none d-md-inline">PDF</span>
					</Button>
					<Button variant='outline-dark' className="mx-md-1" size='sm' onClick={() => onClickJson(albaran.numeroAlbaran)}>
						<Icono icono={FaCode} posicion={[18, 2]} className="mr-md-1" />
						<span className="d-none d-md-inline">JSON</span>
					</Button>
				</Col>
			</Row>
		</Col>
	</Row>
}


export default SimuladorConsultaAlbaranes