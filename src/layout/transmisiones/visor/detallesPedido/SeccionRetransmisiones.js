import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Accordion, Card, Container, Badge, Row } from 'react-bootstrap'
import Icono from 'componentes/icono/Icono'
import ReactJson from 'react-json-view'
import Fecha from 'componentes/transmision/Fecha'
import EtiquetaEstado from 'componentes/transmision/EtiquetaEstado'
import { GoGitBranch } from 'react-icons/go'
import { GiCardExchange } from 'react-icons/gi'



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



export default SeccionRetransmisiones