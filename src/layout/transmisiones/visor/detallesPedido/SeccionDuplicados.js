import React from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Card, Container, Row, Col } from 'react-bootstrap'
import Fecha from 'componentes/transmision/Fecha'


const SeccionDuplicados = ({ tx }) => {

	const duplicados = tx.duplicates
	if (!duplicados?.length > 0) return null

	return (
		<Accordion defaultActiveKey="1" className="my-3">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
					Duplicados del pedido<br />
					<small className="font-weight-bold text-warning ml-3">&raquo; {duplicados.length} {duplicados.length === 1 ? 'duplicado' : 'duplicados'}</small>
				</Accordion.Toggle>

				<Accordion.Collapse eventKey="0">
					<Container fluid>
						{duplicados.map((d, i) => <LineaDuplicado key={i} duplicado={d} />)}
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)
}

const LineaDuplicado = ({ duplicado }) => {
	if (!duplicado) return null

	return (
		<Row className="no-gutters border-top py-3">
			<Col sm={6}><Fecha fecha={duplicado.timestamp} /></Col>
			<Col sm={6}><Link to={`/transmisiones/${duplicado._id}`}>{duplicado._id}</Link></Col>
		</Row>
	)
}


export default SeccionDuplicados