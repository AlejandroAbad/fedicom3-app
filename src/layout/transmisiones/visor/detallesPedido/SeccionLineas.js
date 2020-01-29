import React from 'react'
import { Container, Row, Col, Accordion, Card, Alert } from 'react-bootstrap'
import { FaExclamation } from 'react-icons/fa'

import Icono from 'componentes/icono/Icono'

const SeccionLineas = ({ tx }) => {

	let sum = tx.flags?.s

	let lineas = tx.clientResponse?.body?.lineas?.length > 0 ? tx.clientResponse.body.lineas : tx.clientRequest?.body?.lineas;

	return (
		<>
			<Col sm={12} className="mt-4 mb-1">
				<h5>Líneas del pedido</h5>
			</Col>

			<SumatorioLineas sum={sum} />



			{lineas?.map((l, i) => <LineaPedido key={i} linea={l} />)}


		</>
	)
}

const SumatorioLineas = ({ sum }) => {
	if (!sum) return null

	return (

		<Row className="">
			<Col md={6} className="mx-2 mx-md-0">
				<Alert variant="secondary" className="text-center text-monospace py-1">
					<Col className="font-weight-bold"><u>Total líneas</u></Col>
					<Col className="m-0 p-0">
						<Row className="no-gutters">
							<Col lg={3} md={6} sm={3} xs={6}>Pedidas: {sum.lineas}</Col>
							<Col lg={3} md={6} sm={3} xs={6}>Falta: {sum.lineasIncidencias}</Col>
							<Col lg={3} md={6} sm={3} xs={6}>Demora: {sum.lineasDemorado}</Col>
							<Col lg={3} md={6} sm={3} xs={6}>Estupe: {sum.lineasEstupe}</Col>
						</Row>
					</Col>
				</Alert>
			</Col>

			<Col md={6} className="mx-2 mx-md-0">
				<Alert variant="secondary" className="text-center text-monospace py-1">
					<Col className="font-weight-bold"><u>Total cantidades</u></Col>
					<Col className="m-0 p-0">
						<Row className="no-gutters">
							<Col lg={4} md={6} sm={4} xs={6}>Pedida: {sum.cantidad}{sum.cantidadBonificacion > 0 ? `+${sum.cantidadBonificacion}` : ''}</Col>
							<Col lg={4} md={6} sm={4} xs={6}>Servida: {sum.cantidad - sum.cantidadFalta}{sum.cantidadBonificacion ? `+${sum.cantidadBonificacion - sum.cantidadBonificacionFalta}` : ''}</Col>
							<Col lg={4} md={12} sm={4} xs={12}>Falta: {sum.cantidadFalta}{sum.cantidadBonificacion > 0 ? `+${sum.cantidadBonificacionFalta}` : ''}</Col>
						</Row>
					</Col>
				</Alert>
			</Col>
		</Row>

	)
}

const CodigoArticulo = ({ codigo }) => {
	if (!codigo) return
	let original = codigo
	let extendido = codigo;

	if (codigo.length === 6)
		extendido = <>{codigo}</>
	if (codigo.length === 7)
		extendido = <>{codigo.substring(0, 6)}<span className="text-muted">{codigo.substring(6, 7)}</span></>
	if (codigo.length === 13) {
		if (codigo.startsWith('847000')) {
			extendido = <><span className="text-muted" >{codigo.substring(0, 6)}</span>{codigo.substring(6, 12)}<span className="text-muted">{codigo.substring(12, 13)}</span></>
		} else {
			extendido = <>{codigo}</>
		}
	}


	return <>
		<span className="d-none">{original}</span>
		<span className="">{extendido}</span>
	</>
}

const LineaPedido = ({ linea }) => {

	return (
		<Row className="text-monospace py-2 border-top no-gutters">
			<Col xs="auto" className="border-right pr-3 mr-3">
				<strong>{linea.orden ?? '#'}</strong>
			</Col>
			<Col className="text-truncate">
				<Row className="no-gutters">
					<Col md={3} className="m-0 p-0">
						<Row className="no-gutters">
							<Col xs={12} sm={6} md={12}>
								<strong><CodigoArticulo codigo={linea.codigoArticulo} /></strong>
							</Col>
							<Col xs={12} sm={6} md={12}>
								{linea.codigoAlmacenServicio && <code className="text-muted">Almacén: <strong>{linea.codigoAlmacenServicio}</strong></code>}
							</Col>
						</Row>
					</Col>
					<Col md={6} className="m-0 p-0">
						<Row className="no-gutters">
							<Col xs={12}>
								<code>{linea.descripcionArticulo || 'Artículo desconocido'}</code>
							</Col>
							<Col xs={12} >
								{linea.codigoArticuloSustituyente && <code className="text-muted">Sustituyente: <strong>{linea.codigoArticuloSustituyente}</strong></code>}
							</Col>
						</Row>
					</Col>
					<Col md={3} sm={6} className="text-monospace m-0 p-0">
						<Row className="no-gutters">
							<Col xs={12} sm={6} md={12}>
								Pedido: <span className="font-weight-bold">{linea.cantidad}{linea.cantidadBonificacion > 0 && `+${linea.cantidadBonificacion}`}</span>
							</Col>
							<Col xs={12} sm={6} md={12}>
								<span className="d-none d-sm-inline">&nbsp;</span>
								Falta: <span className="font-weight-bold">{linea.cantidadFalta ?? 0}{linea.cantidadBonificacionFalta > 0 && `+${linea.cantidadBonificacionFalta}`}</span>
							</Col>
						</Row>
					</Col>

					<Col md={4} sm={6}>
						{linea.valeEstupefaciente && <code className="text-muted">Estupe: <strong>{linea.valeEstupefaciente}</strong></code>}
					</Col>


					{linea.incidencias?.length > 0 &&
						<Col xs={12} >
							<Alert variant='warning' className="py-1 mt-2 mb-1 mr-md-5">
								{linea.incidencias.map((inc, e) => (
									<div key={e}>
										<code className="mr-2 ml-0 mr-md-3">
											<Icono icono={FaExclamation} posicion={[18, 2]} />
										</code>
										<code className="text-dark font-weight-bold">{inc.codigo}:</code>
										<code className="text-muted">
											<span className="d-sm-none"><br /></span>
											<span className="ml-sm-1">{inc.descripcion}</span>
										</code>
									</div>
								))}
							</Alert>
						</Col>
					}
				</Row>
			</Col>
		</Row>

	)
}


export default SeccionLineas