import React from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Card, Container, Row, Col } from 'react-bootstrap'
import Fecha from 'componentes/transmision/Fecha'



const SeccionConfirmaciones = ({ tx }) => {

	const confirmaciones = tx.sapConfirms
	if (!confirmaciones?.length > 0) return null

	return (
		<Accordion defaultActiveKey="1" className="my-3">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
					Confirmaciones del pedido<br />
					<small className="font-weight-bold text-success ml-3">&raquo; {confirmaciones.length} {confirmaciones.length === 1 ? 'confirmación' : 'confirmaciones'}</small>
				</Accordion.Toggle>

				<Accordion.Collapse eventKey="0">
					<Container fluid>
						{confirmaciones.map((c, i) => <LineaConfirmacion key={i} confirmacion={c} />)}
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)
}

const LineaConfirmacion = ({ confirmacion }) => {
	if (!confirmacion) return null

	return (
		<Row className="no-gutters border-top py-3">
			<Col md={5} sm={12}><Fecha fecha={confirmacion.timestamp} /></Col>
			<Col md={5} sm={8}><Link to={`/transmisiones/${confirmacion.txId}`}>{confirmacion.txId}</Link></Col>
			<Col md={2} sm={4}>{confirmacion.sapSystem}</Col>
		</Row>
	)
}


export default SeccionConfirmaciones