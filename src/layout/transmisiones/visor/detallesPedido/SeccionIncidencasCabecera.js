import React from 'react'
import { Col, Alert } from 'react-bootstrap'
import Icono from 'componentes/icono/Icono'
import { FaExclamation } from 'react-icons/fa'


const SeccionIncidencasCabecera = ({ tx }) => {

	let incidencias = tx.clientResponse?.body?.incidencias
	let variante = 'warning'
	let titulo = 'Incidencias en cabecera'

	if (!incidencias || incidencias.length === 0) {

		if (tx.clientResponse?.body?.length > 0) {
			incidencias = tx.clientResponse?.body
			variante = 'danger'
			titulo = 'Errores devueltos al cliente'
		} else {
			return null
		}

	}

	// Si la respuesta de SAP incluye incidencias cuyo código empieza por SAP-IGN, las incluimos

	let incidenciasSapIgn = []
	if (tx.sapResponse?.body?.length > 0) {
		tx.sapResponse.body.forEach(inc => {
			if (inc?.codigo?.startsWith('SAP-IGN')) {
				incidenciasSapIgn.push(inc)
			}
		})
	}
	else if (tx.sapResponse?.body?.incidencias?.length > 0) {
		tx.sapResponse.body.incidencias.forEach(inc => {
			if (inc?.codigo?.startsWith('SAP-IGN')) {
				incidenciasSapIgn.push(inc)
			}
		})
	}


	return (
		<>
			<Col xs={12} className="pt-2 pb-1 border-top font-weight-bold">{titulo}:</Col>

			{incidencias.map((inc, e) => (
				<Alert variant={variante} key={e}>
					<code className="mr-2 ml-0 mr-md-3">
						<Icono icono={FaExclamation} posicion={[22, 2]} />
					</code>
					<code className="text-dark font-weight-bold">{inc.codigo || '<sin código>'}:</code>
					<code className="text-muted">
						<span className="d-md-none"><br /></span>
						<span className="ml-md-1">{inc.descripcion}</span>
					</code>
				</Alert>
			))
			}

			{incidenciasSapIgn.length > 0 && <Col xs={12} className="pt-2 pb-1 border-top font-weight-bold">Errores devueltos por SAP:</Col>}
			{incidenciasSapIgn.map((inc, e) => (
				<Alert variant="info" key={e}>
					<code className="mr-2 ml-0 mr-md-3">
						<Icono icono={FaExclamation} posicion={[22, 2]} />
					</code>
					<code className="text-dark font-weight-bold">{inc.codigo || '<sin código>'}:</code>
					<code className="text-muted">
						<span className="d-md-none"><br /></span>
						<span className="ml-md-1">{inc.descripcion}</span>
					</code>
				</Alert>
			))
			}



		</>
	)



}


export default SeccionIncidencasCabecera