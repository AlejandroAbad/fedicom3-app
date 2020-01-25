import K from 'K'
import React from 'react'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Accordion, Card, ListGroup, Badge } from 'react-bootstrap'
import { FaExclamation } from 'react-icons/fa'
import { TextoCodigoCliente, CodigoCliente } from 'componentes/transmision/CodigoCliente'
import Flags from 'componentes/transmision/Flags'
import Icono from 'componentes/icono/Icono'



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
						<SeccionFlags tx={tx} />

						<SeccionLineas tx={tx} />
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)

}

const SeccionLineas = ({ tx }) => {

	let sum = tx.flags?.s

	return (
		<Accordion defaultActiveKey="1" className="my-3">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
					Lineas del pedido
				</Accordion.Toggle>

				{sum &&
					<Container fluid className="text-center">
						<Row class="no-gutters">
							<Col md={6} className="my-2 mx-2 mx-md-0">
								<Row className="no-gutters border-bottom py-1">
									<Col>Lineas</Col>
								</Row>
								<Row className="no-gutters border-bottom py-1">
									<Col>
										<Row className="no-gutters">
											<Col xs={3}>Pedidas</Col>
											<Col xs={3}>Falta</Col>
											<Col xs={3}>Demoradas</Col>
											<Col xs={3}>Estupe</Col>
										</Row>
									</Col>
								</Row>
								<Row className="no-gutters py-1">
									<Col>
										<Row className="no-gutters">
											<Col xs={3}>{sum.lineas}</Col>
											<Col xs={3}>{sum.lineasIncidencias}</Col>
											<Col xs={3}>{sum.lineasDemorado}</Col>
											<Col xs={3}>{sum.lineasEstupe}</Col>
										</Row>
									</Col>
								</Row>
							</Col>

							<Col md={6} className="my-2 mx-2 mx-md-0">
								<Row className="no-gutters border-bottom py-1">
									<Col>Cantidad</Col>
								</Row>
								<Row className="no-gutters border-bottom py-1">
									<Col>
										<Row className="no-gutters">
											<Col xs={4}>Pedida</Col>
											<Col xs={4}>Servida</Col>
											<Col xs={4}>Falta</Col>
										</Row>
									</Col>
								</Row>
								<Row className="no-gutters py-1">
									<Col>
										<Row className="no-gutters">
											<Col xs={4}>{sum.cantidad}+{sum.cantidadBonificacion}</Col>
											<Col xs={4}>{sum.cantidad - sum.cantidadFalta}+{sum.cantidadBonificacion - sum.cantidadBonificacionFalta}</Col>
											<Col xs={4}>{sum.cantidadFalta}+{sum.cantidadBonificacionFalta}</Col>
										</Row>
									</Col>
								</Row>
							</Col>
						</Row>

					</Container>
				}
				<Accordion.Collapse eventKey="0">
					<Container fluid className="border-top">
						<Row className="pt-1">
							<Col lg={6}>
								asdasd
							</Col>
							<Col lg={6}>
								asdasd
							</Col>
						</Row>
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)
}

const LineaPedido = ({ linea }) => {

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
			{tx.clientRequest?.body?.tipoPedido ?? <span class="text-mutted">N/A</span>}<br />
			<code className="text-secondary">SAP {tx.sapResponse?.body?.sap_tipopedido} - Motivo {tx.sapResponse?.body?.sap_motivo_pedido || <span class="text-mutted">N/A</span>}</code>
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
	return (
		<Row className="pt-1 mb-3">
			<Col xs={12}>
				<ListGroup>
					<ListGroupItem sm={1} k="Flags" v={<Flags flags={tx.flags} formato="grande" />} />
					{tx.originalTxId &&
						<ListGroupItem k={
							<span className="text-monospace">
								<Icono icono={FaExclamation} posicion={[22, 2]} className="text-primary mr-3" />
								Este pedido fué creado a raíz de la retransmisión del pedido con ID <Link to={`/transmisiones/${tx.originalTxId}`} className="border rounded px-2 py-1">{tx.originalTxId?.toUpperCase()}</Link>
							</span>
						} />
					}
				</ListGroup>
			</Col>
		</Row>
	)
}

const ListGroupItem = ({ k, v, sm }) => {
	k = k ?? <span>&nbsp;</span>
	if (v !== null) {
		return (
			<ListGroup.Item>
				<Row className="no-gutters">
					<Col sm={sm ?? 6}><strong>{k}</strong></Col>
					<Col sm={sm ? 12 - sm : 6} className="text-sm-right ml-3 ml-sm-0">{v}</Col>
				</Row>
			</ListGroup.Item>
		)
	} else {
		return (
			<ListGroup.Item>
				<Row className="no-gutters">
					<Col xs={12}>{k}</Col>
				</Row>
			</ListGroup.Item>
		)
	}
}


export default DetallesPedido