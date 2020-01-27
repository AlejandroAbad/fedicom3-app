import K from 'K'
import React from 'react'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Accordion, Card, ListGroup, Badge } from 'react-bootstrap'
import { FaExclamation } from 'react-icons/fa'
import { GoGitBranch } from 'react-icons/go'
import { GiCardExchange } from 'react-icons/gi'
import { TextoCodigoCliente, CodigoCliente } from 'componentes/transmision/CodigoCliente'
import Fecha from 'componentes/transmision/Fecha'
import Flags from 'componentes/transmision/Flags'
import Icono from 'componentes/icono/Icono'
import ReactJson from 'react-json-view';
import EtiquetaEstado from 'componentes/transmision/EtiquetaEstado';

import ListGroupItem from './ListGroupItem'


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
						<SeccionRetransmisiones tx={tx} />
						<SeccionConfirmaciones tx={tx} />
						<SeccionDuplicados tx={tx} />
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)

}




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

const LineaConfirmacion = ({confirmacion}) => {
	if (!confirmacion ) return null

	return (
		<Row className="no-gutters border-top py-3">
			<Col md={5} sm={12}><Fecha fecha={confirmacion.timestamp} /></Col>
			<Col md={5} sm={8}><Link to={`/transmisiones/${confirmacion.txId}`}>{confirmacion.txId}</Link></Col>
			<Col md={2} sm={4}>{confirmacion.sapSystem}</Col>
		</Row>
	)
}


const SeccionRetransmisiones = ({ tx }) => {

	const rtxs = tx.retransmissions
	if (!rtxs?.length > 0) return null

	return (
		<Accordion defaultActiveKey="1" className="my-3">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
					Retransmisiones del pedido<br />
					<small className="font-weight-bold text-primary ml-3">&raquo; {rtxs.length} {rtxs.length === 1 ? 'retransmisión' : 'retransmisiones'}</small>
				</Accordion.Toggle>

				<Accordion.Collapse eventKey="0">
					<Container fluid>
						{rtxs.map((r, i) => <LineaRetransmision key={i} rtx={r} />)}
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)
}

const LineaRetransmision = ({ rtx }) => {
	if (!rtx) return null

	// OPCIONES
	let opciones = []
	rtx.options?.force && opciones.push(<Badge key={opciones.length} variant="warning ml-1" >Forzado</Badge>)
	rtx.options?.noActualizarOriginal && opciones.push(<Badge key={opciones.length} variant="secondary ml-1" >Evita actualizar</Badge>)
	rtx.options?.forzarAlmacen && opciones.push(<Badge key={opciones.length} variant="primary ml-1" >Almacén: {rtx.options.forzarAlmacen}</Badge>)
	rtx.options?.sistemaSAP && opciones.push(<Badge key={opciones.length} variant="info ml-1" >Sistema SAP: {rtx.options.sistemaSAP}</Badge>)

	// VALORES ACTUALIZADOS
	let campoCambios = null
	let opcionesJson = {
		collapsed: true,
		name: false,
		iconStyle: "square",
		displayDataTypes: false,
		displayObjectSize: false
	}

	if (rtx.oldValues && rtx.newValues) {
		campoCambios = (
			<>
				<Col md={6} className="border rounded  py-2 px-4 mt-2">
					<strong className="text-monospace d-block border-bottom">Valores viejos:</strong>
					<ReactJson src={rtx.oldValues} {...opcionesJson} />
				</Col>
				<Col md={6} className="border rounded py-2 px-4 mt-2">
					<strong className="text-monospace d-block border-bottom">Valores nuevos:</strong>
					<ReactJson src={rtx.newValues} {...opcionesJson} />
				</Col>
			</>
		)
	} else if (rtx.newValues) {
		campoCambios = (
			<>
				<Col md={6} className="border rounded py-2 px-4 mt-2">
					<strong className="text-monospace d-block border-bottom">Valores nuevos:</strong>
					<ReactJson src={rtx.newValues} {...opcionesJson} />
				</Col>
			</>
		)
	}



	return (
		<Row className="px-2 pt-5 border-top mx-3 mb-5">
			<Col md={6} className="mb-1">
				<Fecha fecha={rtx.timestamp} />
			</Col>
			<Col md={6} className="text-monospace mb-1">
				<strong className="d-none d-sm-inline mr-1">RTX Id:</strong>{rtx._id}
			</Col>

			<Col md={2} className="mb-1">
				<EtiquetaEstado className="text-reset" estado={rtx.status} />
			</Col>
			{
				(opciones.length > 0) &&
				<Col md={10} className="text-monospace mb-1">
					<strong className="mr-2">Opciones:</strong>{opciones}
				</Col>
			}
			{
				rtx.options?.ctxId &&
				<Col md={12}>
					<span className="text-monospace mb-1">
						<Icono icono={GoGitBranch} posicion={[22, 2]} className="text-primary mr-3" />
						Se generó un clon con ID <Link to={`/transmisiones/${rtx.options.ctxId}`} className="">{rtx.options.ctxId.toUpperCase()}</Link>.
					</span>
				</Col>
			}
			{
				rtx.oldValues &&
				<Col md={12}>
					<span className="text-monospace mb-1">
						<Icono icono={GiCardExchange} posicion={[22, 2]} className="text-danger mr-3" />
						Se actualizaron los datos de la transmisión original.
					</span>
				</Col>
			}

			{campoCambios}



		</Row>
	)
}

const SeccionLineas = ({ tx }) => {

	let sum = tx.flags?.s

	return (
		<Accordion defaultActiveKey="0" className="my-3">
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey="0" className="h5">
					Lineas del pedido
				</Accordion.Toggle>

				<Accordion.Collapse eventKey="0">
					<Container fluid>
						<SumatorioLineas sum={sum} />

						<Accordion defaultActiveKey="1" className="my-3">
							<Card>
								<Accordion.Toggle as={Card.Header} eventKey="0" className="h5 bg-secondary text-white">
									Detalle de líneas
								</Accordion.Toggle>

								<Accordion.Collapse eventKey="0">
									<Container fluid className="border-top">
										{tx.clientResponse?.body?.lineas?.map((l, i) => <LineaPedido key={i} linea={l} />)}
									</Container>
								</Accordion.Collapse>
							</Card>
						</Accordion>
					</Container>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	)
}

const SumatorioLineas = ({ sum }) => {
	if (!sum) return null

	return (
		<Container fluid className="text-center text-monospace">
			<Row className="no-gutters">
				<Col md={6} className="my-2 mx-2 mx-md-0">
					<Row className="no-gutters border-bottom py-1">
						<Col>Lineas</Col>
					</Row>
					<Row className="no-gutters border-bottom py-1">
						<Col>
							<Row className="no-gutters">
								<Col xs={3}>Pedidas</Col>
								<Col xs={3}>Falta</Col>
								<Col xs={3}>Demora</Col>
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
	)
}

const CodigoArticulo = ({ codigo }) => {
	if (!codigo) return

	if (codigo.length === 6)
		return <>{codigo}</>
	if (codigo.length === 7)
		return <>{codigo.substring(0, 6)}.{codigo.substring(6, 7)}</>
	if (codigo.length === 13)
		return <>{codigo}</>

	return codigo
}

const LineaPedido = ({ linea }) => {


	return (
		<Row className="text-monospace py-2 border-top no-gutters">
			<Col md={1}>{linea.orden ? <>
				<span className="d-md-none font-weight-bold tex">Orden: </span>
				<span className="d-none d-md-inline text-muted">#</span>
				{linea.orden}</> : '-'}
			</Col>
			<Col md={3}>
				<strong><CodigoArticulo codigo={linea.codigoArticulo} /></strong>
			</Col>
			<Col md={6} className="text-truncate">
				<code>{linea.descripcionArticulo || 'Artículo desconocido'}</code>
			</Col>
			<Col md={1} sm={6}>
				<span className="d-md-none font-weight-bold">Cantidad: </span>{linea.cantidad}{linea.cantidadBonificacion > 0 && `+${linea.cantidadBonificacion}`}
			</Col>
			<Col md={1} sm={6}>
				<span className="d-md-none font-weight-bold">Falta: </span> {linea.cantidadFalta ?? 0}{linea.cantidadBonificacionFalta > 0 && `+${linea.cantidadBonificacionFalta}`}
			</Col>

			{linea.codigoArticuloSustituyente &&
				<Col md={4} sm={6}>
					<code className="text-muted">Sustituye: <strong>{linea.codigoArticuloSustituyente}</strong></code>
				</Col>
			}
			<Col md={4} sm={6}>
				{linea.valeEstupefaciente && <code className="text-muted">Estupe: <strong>{linea.valeEstupefaciente}</strong></code>}
			</Col>
			<Col md={4} sm={6}>
				{linea.codigoAlmacenServicio && <code className="text-muted">Almacén: <strong>{linea.codigoAlmacenServicio}</strong></code>}
			</Col>

			{linea.incidencias?.length > 0 &&
				<>
					<Col xs={12}>
						<code className="mr-2 ml-0 mr-md-3">
							<Icono icono={FaExclamation} posicion={[18, 2]} className="text-warning" />
						</code>
						<code className="text-dark font-weight-bold">{linea.incidencias[0].codigo}</code>
						<code className="text-muted">
							<span className="d-none d-md-inline"> - </span>
							<span className="d-md-none"><br /></span>
							<span className="ml-5 ml-md-0">{linea.incidencias[0].descripcion}</span>
						</code>
					</Col>
				</>
			}

		</Row>

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
			<code className="text-secondary">SAP {tx.sapResponse?.body?.sap_tipopedido} - Motivo {tx.sapResponse?.body?.sap_motivo_pedido || <span className="text-mutted">N/A</span>}</code>
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



export default DetallesPedido