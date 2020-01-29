import K from 'K'
import React from 'react'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Accordion, Card, ListGroup, Badge, Alert } from 'react-bootstrap'
import { FaExclamation } from 'react-icons/fa'
import { TextoCodigoCliente, CodigoCliente } from 'componentes/transmision/CodigoCliente'
import Flags from 'componentes/transmision/Flags'
import Icono from 'componentes/icono/Icono'

import ListGroupItem from '../ListGroupItem'

import SeccionDuplicados from './SeccionDuplicados';
import SeccionConfirmaciones from './SeccionConfirmaciones';
import SeccionIncidencasCabecera from './SeccionIncidencasCabecera';
import SeccionRetransmisiones from './SeccionRetransmisiones';
import SeccionLineas from './SeccionLineas';


const DetallesPedido = ({ transmision }) => {
	if (transmision?.type !== 10) return null // Si no es un pedido no pintar nada
	let tx = transmision

	return (
		<Accordion defaultActiveKey="0" className="mt-3">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
					Detalles del pedido
    			</Accordion.Toggle>
				<Accordion.Collapse eventKey="0">
					<Container fluid>
						<Row className="pt-1">
							<Col lg={6}>
								<ListGroup variant="flush" className="border-bottom border-lg-bottom-0">
									<SeccionCrc tx={tx} />
									<SeccionNumPedFedicom tx={tx} />
									<SeccionNumPedOrigen tx={tx} />
									<SeccionTipoPedido tx={tx} />
								</ListGroup>
							</Col>
							<Col lg={6}>
								<ListGroup variant="flush">
									<SecccionUsuario tx={tx} />
									<SeccionAlmacen tx={tx} />
									<SeccionNumPedSAP tx={tx} />
								</ListGroup>
							</Col>
						</Row>
						<SeccionIncidencasCabecera tx={tx} />
						<SeccionFlags tx={tx} />
						<SeccionLineas tx={tx} />
						<SeccionRetransmisiones tx={tx} />
						<SeccionConfirmaciones tx={tx} />
						<SeccionDuplicados tx={tx} />
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)

}





const SeccionCrc = ({ tx }) => {
	return <ListGroupItem k="CRC" v={<span className="text-monospace">{tx.crc?.substring(0, 8).toUpperCase()}</span>} />
}

const SeccionNumPedFedicom = ({ tx }) => {
	return <ListGroupItem sm={5} k="Número pedido Fedicom" v={<span className="text-monospace">{tx.crc?.toUpperCase()}</span>} />
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

const SeccionTipoPedido = ({ tx }) => {
	let valorTipoPedido = (
		<span className="text-monospace">
			{tx.clientRequest?.body?.tipoPedido ?? <span className="text-mutted">N/A</span>}<br />
			<code className="text-secondary">SAP {tx.sapResponse?.body?.sap_tipopedido} - Motivo: {tx.sapResponse?.body?.sap_motivo_pedido || <span className="text-mutted"><i>&lt;vacío&gt;</i></span>}</code>
		</span>
	)
	return <ListGroupItem sm={4} k="Tipo pedido" v={valorTipoPedido} />
}

const SecccionUsuario = ({ tx }) => {
	let valorCliente = (
		<span className="text-monospace">
			<TextoCodigoCliente codigoCliente={tx.client} />
			{(tx.flags?.pt) && <>
				{' @ '}<span className="text-monospace text-secondary">{tx.flags.pt}</span>
			</>}
			{(tx.sapResponse?.body?.sap_cliente && tx.client !== tx.sapResponse.body.sap_cliente) && <>
				<br />
				<code className="text-secondary">SAP <TextoCodigoCliente codigoCliente={tx.sapResponse.body.sap_cliente} /></code>
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

const SeccionNumPedSAP = ({ tx }) => {
	let valorNumerosPedidoSAP = <Badge variant='warning'>N/A</Badge>
	if (tx.numerosPedidoSAP) {

		valorNumerosPedidoSAP = tx.numerosPedidoSAP.map((npedSap, i) => {
			return <span key={i} variant='light' className="border rounded text-monospace ml-1 px-1">{npedSap}</span>
		})

		if (tx.numeroPedidoAgrupado) {
			valorNumerosPedidoSAP = (<>
				{valorNumerosPedidoSAP}<br />
				<code className="text-secondary">Agrupando sobre <span variant='light'>{tx.numeroPedidoAgrupado}</span></code>
			</>)
		}
	} else if (tx.numeroPedidoAgrupado) {
		valorNumerosPedidoSAP = <span className="text-monospace">Agrupando sobre <span variant='light'>{tx.numeroPedidoAgrupado}</span></span>
	}
	return <ListGroupItem sm={4} k="Números pedido SAP" v={valorNumerosPedidoSAP} />
}

const SeccionFlags = ({ tx }) => {

	if (!tx.flags) return null;
	const FLAGS_EXCL = ['s', 'v', 'pt', 't']
	let numeroFlags = Object.keys(tx.flags).filter(e => !FLAGS_EXCL.includes(e)).length
	if (!numeroFlags) return null;

	return (<>
		{
			tx.originalTxId &&
			<Alert variant='primary' className="text-monospace">
				<Icono icono={FaExclamation} posicion={[22, 2]} className="text-primary mr-3" />
				Este pedido fué creado a raíz de la retransmisión del pedido con ID <Link to={`/transmisiones/${tx.originalTxId}`}>{tx.originalTxId?.toUpperCase()}</Link>
			</Alert>
		}

		<Row className="pt-1">
			<Col xs={12}>
				<ListGroup>
					<ListGroupItem sm={1} k="Flags" v={<Flags flags={tx.flags} formato="grande" />} />
				</ListGroup>
			</Col>
		</Row>

	</>
	)
}



export default DetallesPedido