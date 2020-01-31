import K from 'K'
import React from 'react'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Accordion, Card, ListGroup, Badge, Alert } from 'react-bootstrap'
import { TextoCodigoCliente, CodigoCliente } from 'componentes/transmision/CodigoCliente'

import ListGroupItem from '../ListGroupItem'


const DetallesConfirmacion = ({ transmision }) => {
	if (transmision?.type !== 13) return null // Si no es una confirmacion de pedido no pintar nada
	let tx = transmision

	let crc = tx.clientRequest?.body?.crc

	let numerosPedido = []
	if (tx.clientRequest?.body?.sap_pedidosasociados?.length > 0) {
		tx.clientRequest.body.sap_pedidosasociados.forEach(nped => {
			if (nped) numerosPedido.push(nped)
		})
	}

	return (
		<Accordion defaultActiveKey="0" className="mt-3">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
					Confirmación del pedido
    			</Accordion.Toggle>
				<Accordion.Collapse eventKey="0">
					<Container fluid>
						<Row className="pt-3">
							<Col xs={12}>
								{numerosPedido.length > 0 ?
									<Alert variant="success">
										<Alert.Heading>¡ Confirmación de pedido !</Alert.Heading>
										Esta transmisión confirma el procesamiento en SAP del pedido con CRC <Alert.Link as={Link} to={`/transmisiones/${tx.confirmingId}`}>{crc?.toUpperCase()}</Alert.Link>.<br />
										Recibido originalmente en la transmisión con ID <Alert.Link as={Link} to={`/transmisiones/${tx.confirmingId}`}>{tx.confirmingId?.toUpperCase()}</Alert.Link>.
									</Alert>
									:
									<Alert variant="danger">
										<Alert.Heading>¡ Sin número de pedido !</Alert.Heading>
										Esta transmisión confirma el procesamiento en SAP del pedido con CRC <Alert.Link as={Link} to={`/transmisiones/${tx.confirmingId}`}>{crc?.toUpperCase()}</Alert.Link>, pero no devuelve ningún número de pedido.<br/>
										Esta situación ocurre cuando la BAPI explota y no emite ningún motivo de error.<br />
										El pedido fue recibido originalmente en la transmisión con ID <Alert.Link as={Link} to={`/transmisiones/${tx.confirmingId}`}>{tx.confirmingId?.toUpperCase()}</Alert.Link>.
									</Alert>
								}			
							</Col>
						</Row>
						<Row >
							<Col lg={6}>
								<ListGroup variant="flush" className="border-bottom border-lg-bottom-0">
									<SeccionCrc crc={crc} />
									<SeccionNumPedOrigen tx={tx} />
									<SeccionTipoPedido tx={tx} />
								</ListGroup>
							</Col>
							<Col lg={6}>
								<ListGroup variant="flush">
									<SecccionUsuario tx={tx} />
									<SeccionAlmacen tx={tx} />
									<SeccionNumPedSAP numerosPedido={numerosPedido} />
								</ListGroup>
							</Col>
						</Row>
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)

}





const SeccionCrc = ({ crc }) => {
	return <ListGroupItem k="CRC" v={<span className="text-monospace">{crc?.substring(0, 8).toUpperCase()}</span>} />
}


const SeccionNumPedOrigen = ({ tx }) => {
	let valorNumPedOrigen = tx.clientRequest?.body?.numeropedidoorigen
	if (valorNumPedOrigen) {
		if (valorNumPedOrigen.length > 27)
			valorNumPedOrigen = <>
				<abbr className="text-decoration-none d-none d-lg-inline-block" title={valorNumPedOrigen}>
					{valorNumPedOrigen.substring(0, 23)}<code>...</code>
				</abbr>
				<span className="d-inline-block d-lg-none text-truncate">{valorNumPedOrigen}</span>
			</>
	}
	return <ListGroupItem sm={5} k="Número pedido Origen" v={<span className="text-monospace">{valorNumPedOrigen}</span>} />
}

const SeccionTipoPedido = ({ tx }) => {
	let valorTipoPedido = (
		<span className="text-monospace">
			{tx.clientRequest?.body?.tipopedido || <span className="text-mutted">n/a</span>}<br />
			<code className="text-secondary">
				Tipo SAP: {tx.clientRequest?.body?.sap_tipopedido ?? <span className="text-mutted"><i>&lt;vacío&gt;</i></span>} | 
				Motivo: {tx.clientRequest?.body?.sap_motivo_pedido || <span className="text-mutted"><i>&lt;vacío&gt;</i></span>}
			</code>
		</span>
	)
	return <ListGroupItem sm={4} k="Tipo pedido" v={valorTipoPedido} />
}

const SecccionUsuario = ({ tx }) => {
	let valorCliente = (
		<span className="text-monospace">
			<TextoCodigoCliente codigoCliente={tx.clientRequest?.body?.codigocliente} />
			{(tx.clientRequest?.body?.sap_punto_entrega) && <>
				{' @ '}<span className="text-monospace text-secondary">{tx.clientRequest.body.sap_punto_entrega}</span>
			</>}
			{(tx.clientRequest?.body?.sap_cliente && tx.client !== tx.clientRequest.body.sap_cliente) && <>
				<br />
				<code className="text-secondary">SAP <TextoCodigoCliente codigoCliente={tx.clientRequest.body.sap_cliente} /></code>
			</>}
		</span>
	)
	let usuarioAuthenticado = new CodigoCliente(tx.authenticatingUser)

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

const SeccionAlmacen = ({ tx }) => {
	let nombreAlmacenElegido = K.ALMACENES[tx.clientResponse?.body?.codigoAlmacenServicio] || <span className="text-warning">Desconocido</span>
	let nombreAlmacenSolicitado = K.ALMACENES[tx.clientRequest?.body?.codigoAlmacenServicio] || <span className="text-warning">Desconocido</span>
	let valorAlmacen = <Badge variant="secondary">N/A</Badge>
	if (tx.clientResponse?.body?.codigoAlmacenServicio) {
		valorAlmacen = (<>
			<abbr className="text-monospace text-decoration-none" title={tx.clientResponse?.body?.codigoAlmacenServicio}>{nombreAlmacenElegido}</abbr>
			{
				(tx.clientRequest?.body?.codigoAlmacenServicio) &&
				<>
					<br />
					<code className="text-muted">
						Solicitado <abbr className="text-decoration-none" title={tx.clientRequest?.body?.codigoAlmacenServicio} >{nombreAlmacenSolicitado}</abbr>
					</code>
				</>
			}
		</>)
	} else if (tx.clientRequest?.body?.codigoAlmacenServicio) {
		valorAlmacen = (<>
			<abbr className="text-monospace text-decoration-none" title={tx.clientRequest?.body?.codigoAlmacenServicio}>{nombreAlmacenSolicitado}</abbr>
			<br /> <code className="text-muted">SAP no confirma el almacén</code>
		</>)
	}
	return <ListGroupItem k="Almacén" v={valorAlmacen} />
}

const SeccionNumPedSAP = ({ numerosPedido }) => {
	let valorNumerosPedidoSAP = <Badge variant='danger'>N/A</Badge>



	if (numerosPedido.length > 0) {
		valorNumerosPedidoSAP = numerosPedido.map((npedSap, i) => {
			return <span key={i} variant='light' className="border rounded text-monospace ml-1 px-1">{npedSap}</span>
		})
	}
	return <ListGroupItem sm={4} k="Números pedido SAP" v={valorNumerosPedidoSAP} />
}



export default DetallesConfirmacion