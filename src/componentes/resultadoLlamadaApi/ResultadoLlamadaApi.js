import React from 'react';
import { ProgressBar, Container, Row, Col } from 'react-bootstrap';
import ReactJson from 'react-json-view';

const ResultadoLlamadaApi = ({ id, resultado, ...props }) => {

	const { cargando, datos, error, query, respuesta } = resultado

	let estado = null
	if (cargando) {
		estado = <ProgressBar animated now={100} label="Cargando ..." className="my-3" />
	}
	else {
		if (error) estado = <ProgressBar now={100} variant="danger" label={`ERROR ${respuesta?.status || ""}`} className="my-3" />
		else if (datos) estado = <ProgressBar now={100} variant="success" label={`OK ${respuesta?.status || ""}`} className="my-3" />
		else estado = <ProgressBar now={100} variant="dark" label={`Consulta no ejecutada`} className="my-3" />
	}

	return (
		<Container fluid id="example-collapse-text" className="mt-4 mb-5">
			<Row>
				<Col lg={4}>
					<h3>Consulta</h3>
					{query && <ReactJson src={query} />}
				</Col>
				<Col lg={8}>
					<h3>Respuesta</h3>
					{estado}
					{!cargando && (datos||error) && <ReactJson src={datos || error || {}} shouldCollapse={(key) => { return ['headers', 'lineas', 'clientResponse', 'clientRequest', 'sapResponse', 'sapRequest', 'sapConfirms', 's'].includes(key.name) }} />}
				</Col>
			</Row>
		</Container>
	)
}

export default ResultadoLlamadaApi