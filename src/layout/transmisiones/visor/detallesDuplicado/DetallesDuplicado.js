import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Accordion, Card, ListGroup, Badge, Alert } from 'react-bootstrap'
import { TextoCodigoCliente, CodigoCliente } from 'componentes/transmision/CodigoCliente'


import ListGroupItem from '../ListGroupItem'

import SeccionIncidencasCabecera from '../detallesPedido/SeccionIncidencasCabecera';


const DetallesDuplicado = ({ transmision }) => {
	if (transmision?.type !== 12) return null // Si no es un pedido duplicado, no pintar nada
	let tx = transmision

	let numPedFedicom = null

	if (tx.clientResponse?.body?.length > 0) {
		tx.clientResponse.body.forEach( incidencia => {
			if (incidencia.codigo === 'PED-ERR-008') {
				numPedFedicom = incidencia.descripcion.slice(-24)
			}
		})
	}

	return (
		<Accordion defaultActiveKey="0" className="mt-3">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
					Pedido duplicado
    			</Accordion.Toggle>
				<Accordion.Collapse eventKey="0">
					<Container fluid>
						<Row className="pt-3">
							<Col xs={12}>
								<Alert variant="info">
									<Alert.Heading>¡ Transmisión duplicada !</Alert.Heading>
									Esta transmisión es un duplicado del pedido con CRC <Alert.Link as={Link} to={`/transmisiones/${tx.originalTx}`}>{numPedFedicom?.substring(0, 8).toUpperCase()}</Alert.Link>.<br />
									Recibido originalmente en la transmisión con ID <Alert.Link as={Link} to={`/transmisiones/${tx.originalTx}`}>{tx.originalTx?.toUpperCase()}</Alert.Link>.
								</Alert>
							</Col>
						</Row>
						<Row>
							<Col lg={6}>
								<ListGroup variant="flush" className="border-bottom border-lg-bottom-0">
									<SeccionCrc numPedFedicom={numPedFedicom} />
									<SeccionNumPedFedicom numPedFedicom={numPedFedicom} />
									<SeccionNumPedOrigen tx={tx} />
								</ListGroup>
							</Col>
							<Col lg={6}>
								<ListGroup variant="flush">
									<ListGroupItem k="Tx Original" v={<span className="text-monospace">{tx.originalTx?.toUpperCase() || <Badge variant="warning">n/a</Badge>}</span>} />
									<SecccionUsuario tx={tx} />
								</ListGroup>
							</Col>
						</Row>
						<SeccionIncidencasCabecera tx={tx} />
						
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)

}



const SeccionCrc = ({ numPedFedicom }) => {
	return <ListGroupItem k="CRC" v={<span className="text-monospace">{numPedFedicom?.substring(0, 8).toUpperCase()}</span>} />
}

const SeccionNumPedFedicom = ({ numPedFedicom }) => {
	return <ListGroupItem sm={5} k="Número pedido Fedicom" v={<span className="text-monospace">{numPedFedicom?.toUpperCase()}</span>} />
}

const SeccionNumPedOrigen = ({ tx }) => {
	let valorNumPedOrigen = tx.clientRequest?.body?.numeroPedidoOrigen
	if (valorNumPedOrigen) {
		if (valorNumPedOrigen.length > 27)
			valorNumPedOrigen = <>
				<abbr className="text-decoration-none d-none d-lg-inline-block" title={tx.clientRequest.body.numeroPedidoOrigen}>
					{valorNumPedOrigen.substring(0, 23)}<code>...</code>
				</abbr>
				<span className="d-inline-block d-lg-none text-truncate">{valorNumPedOrigen}</span>
			</>
	}
	return <ListGroupItem sm={5} k="Número pedido Origen" v={<span className="text-monospace">{valorNumPedOrigen}</span>} />
}

const SecccionUsuario = ({ tx }) => {
	let valorCliente = (
		<span className="text-monospace">
			<TextoCodigoCliente codigoCliente={tx.clientRequest?.body?.codigoCliente} />
		</span>
	)
	let usuarioAuthenticado = new CodigoCliente(tx.clientRequest?.authentication?.sub)

	return (<>
		<ListGroupItem sm={3} k="Cliente" v={valorCliente} />
		{
			usuarioAuthenticado.isLaboratorio() ?
				<ListGroupItem k="Laboratorio" v={<><TextoCodigoCliente codigoCliente={usuarioAuthenticado} /> <code className="text-reset">{usuarioAuthenticado.codigoLaboratorio}</code></>} />
				:
				<ListGroupItem k="Autenticado como" v={<TextoCodigoCliente codigoCliente={usuarioAuthenticado} />} />
		}

	</>)
}




export default DetallesDuplicado