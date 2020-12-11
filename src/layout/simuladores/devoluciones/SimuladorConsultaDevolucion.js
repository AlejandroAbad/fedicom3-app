import K from 'K'
import React, { useRef, useState, useContext } from 'react'
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap"
import Icono from 'componentes/icono/Icono'
import { FaRegFilePdf, FaCode } from 'react-icons/fa'
import fedicomFetch, { fedicomFetchPdf } from 'util/fedicomFetch'
import ConsultaError from 'componentes/estadoConsulta/ConsultaError'
import ConsultaCargando from 'componentes/estadoConsulta/ConsultaCargando'
import ConsultaVacia from 'componentes/estadoConsulta/ConsultaVacia'
import ReactJson from 'react-json-view'
import ContextoAplicacion from 'contexto'


const SimuladorConsultaDevolucion = () => {

	const { jwt } = useContext(ContextoAplicacion);

	// Referencias a los campos del buscador

	const refNumeroDevolucion = useRef();
	const refDescargaPdf = useRef()

	const [resultado, setResultado] = useState({ cargando: false, datos: null, error: null, tipo: 'lista' })


	const consultaDevolucionJson = (numeroDevolucion) => {

		if (!numeroDevolucion) {
			numeroDevolucion = refNumeroDevolucion.current.value
		}

		if (!numeroDevolucion) {
			setResultado({ datos: null, error: [{ codigo: "DEV-ERR-API", descripcion: "Debes indicar el número de devolución" }], cargando: false, tipo: 'json' })
			return;
		}

		setResultado({ datos: null, error: null, cargando: true, tipo: 'json' })


		fedicomFetch(K.DESTINOS.CORE + '/devoluciones/' + numeroDevolucion, { method: 'GET' }, jwt)
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

	const consultaDevolucionPdf = (numeroDevolucion) => {

		if (!numeroDevolucion) {
			numeroDevolucion = refNumeroDevolucion.current.value
		}

		if (!numeroDevolucion) {
			setResultado({ datos: null, error: [{ codigo: "DEV-ERR-API", descripcion: "Debes indicar el número de devolución" }], cargando: false, tipo: 'pdf' })
			return;
		}

		setResultado({ datos: null, error: null, cargando: true, tipo: 'pdf' })

		fedicomFetchPdf(K.DESTINOS.CORE + '/devoluciones/' + numeroDevolucion, refDescargaPdf, { method: 'GET', fileName: numeroDevolucion + '.pdf' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ datos: response.body, error: null, cargando: false, tipo: 'pdf' });
					} else {
						setResultado({ datos: null, error: [{ codigo: 'ERR-DEV-999', descripcion: 'No se encuentra la devolución' }], cargando: false, tipo: 'pdf' });
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
		if (resultado.tipo === 'json') {
			contenedorResultado = <div className="mt-5">
				<h5>Resultado de la búsqueda:</h5>
				<ReactJson src={resultado.datos} name="albaran" displayObjectSize={false} displayDataTypes={false} enableClipboard={false} />
			</div>
		} else if (resultado.tipo === 'pdf') {
			contenedorResultado = <pre className="mt-5">
				<Alert variant="primary">
					<Alert.Heading>Descargando devolución PDF ...</Alert.Heading>
					La devolución se descargará en unos instantes.
				</Alert>
			</pre>
		}
	}


	return <Container>
		<a ref={refDescargaPdf} href="/" className="d-none">as</a>

		<h4 className="border-bottom pb-2 mb-4">
			Consulta de devoluciones
		</h4>

		<Row>
			<Col>
				<Card>
					<Card.Header>Búsqueda directa por número de devolución</Card.Header>
					<Card.Body>
						<Card.Text as="div">
							<Form.Group as={Row} className="align-items-center px-3">
								<Form.Label column sm={12} md={3}>
									Número de devolucion
								</Form.Label>
								<Col sm={12} md={3}>
									<Form.Control size="sm" type="text" className="text-center" ref={refNumeroDevolucion} />
								</Col>
							</Form.Group>
						</Card.Text>

						<Button variant='outline-success' className="mx-1" onClick={() => consultaDevolucionPdf()}>
							<Icono icono={FaRegFilePdf} posicion={[22, 2]} className="mr-1" />PDF
						</Button>
						<Button variant='outline-success' className="mx-1" onClick={() => consultaDevolucionJson()}>
							<Icono icono={FaCode} posicion={[22, 2]} className="mr-1" />JSON
						</Button>

					</Card.Body>
				</Card>
			</Col>
		</Row>

		{contenedorResultado}

	</Container>

}





export default SimuladorConsultaDevolucion