import K from 'K'
import React, { useState, useRef, useCallback } from 'react'
import { Button, Modal, Form, Row, Col, Alert, Spinner } from 'react-bootstrap'
import './RetransmitirPedido.scss'
import Icono from 'componentes/icono/Icono'
import { FaRetweet } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import fedicomFetch from 'util/fedicomFetch'
import { LinkContainer } from 'react-router-bootstrap'

const OPCIONES_ALMACEN = Object.keys(K.ALMACENES).map((codigo, i) => {
	return {
		value: codigo,
		label: codigo + ' - ' + K.ALMACENES[codigo]
	}
})

const OPCIONES_SAP = (K.PRODUCCION ?
	[{ value: 'P01', label: 'P01' }, { value: 'T01', label: 'T01' }, { value: 'D01', label: 'D01' }] :
	[{ value: 'T01', label: 'T01' }, { value: 'D01', label: 'D01' }]
)



const BotonRetransmitir = ({ transmision, jwt, onPedidoModificado }) => {

	let tx = transmision
	let almacenOriginal = tx?.clientResponse?.body?.codigoAlmacenServicio;
	let txId = tx._id

	const [mostrar, setMostar] = useState(false)
	const [clonar, setClonar] = useState(false)
	const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false })

	const refClone = useRef()
	const refAlmacen = useRef()
	const refSap = useRef()

	const ocultarModal = () => {
		if (resultado.datos || resultado.error) {
			onPedidoModificado()
		}
		setMostar(false)
	}

	const retransmitirPedido = useCallback(() => {
		setResultado({ datos: null, error: null, cargando: true });


		let almacen = refAlmacen?.current?.value
		let sap = refSap?.current?.value

		let url = K.DESTINOS.CORE + '/retransmitir/' + txId + '?forzar=si'
		if (clonar) {
			url += '&almacen=' + almacen
			if (sap !== (K.PRODUCCION ? 'P01' : 'T01'))
				url += '&sistemaSAP=' + sap
		}

		fedicomFetch(url, { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ datos: response.body, error: null, cargando: false });
					} else {
						setResultado({ datos: null, error: response.body, cargando: false });
					}
				}

			})
			.catch(error => {
				setResultado({ datos: null, error, cargando: false });
			})
	}, [setResultado, txId, jwt, clonar])

	if (transmision?.type !== 10) return null	 // Si no es un pedido no pintar nada

	let body = null
	let formulario = (<>
		<Form.Group as={Row} className="align-items-center">
			<Col md="12" column="true">
				<Form.Check
					custom
					defaultChecked={clonar}
					type='checkbox'
					label='Cambiar datos del pedido'
					ref={refClone}
					onClick={(e) => { setClonar(e.target.checked) }}
					id={`clonar`}
				/>
			</Col>
			<Form.Label column="true" className="text-muted">
				<Alert variant={clonar ? "danger" : "primary"} className="mt-3 mb-0 pb-0">
					{clonar ?
						<>
							<b>Advertencia:</b> Has marcado la opción de <i>Cambiar los datos del pedido</i>:
							<ul>
								<li>Esto genera un CRC nuevo, lo que implica que SAP <b>NUNCA</b> DETECTARÁ EL NUEVO PEDIDO COMO DUPLICADO.</li>
								<li>¡¡ Incluso si se utiliza el mismo almacén !!</li>
								<li>¡¡ Incluso si se reenvía varias veces con este método !!</li>
								<li>No digas que no te lo he avisado ...</li>
							</ul>
						</>
						:
						<ul>
							<li>El pedido se retransmitirá con el mismo CRC y <b>SAP decidirá si es duplicado o no</b>.</li>
							<li>Esta acción puede hacer que varíen los datos que se devolvieron originalmente al cliente como las faltas, el almacén de servicio, etc...</li>
						</ul>
					}
				</Alert>
			</Form.Label>
		</Form.Group>
		{clonar && <>
			<Form.Group as={Row} className="align-items-center">
				<Form.Label column md="4">
					Almacén de servicio
				</Form.Label>
				<Col md="8" >
					<Form.Control as="select" defaultValue={almacenOriginal} ref={refAlmacen}>
						{OPCIONES_ALMACEN.map((opt, i) => {
							return <option key={i} value={opt.value}>{opt.label}</option>
						})}
					</Form.Control>
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="align-items-center">
				<Form.Label column md="4">
					Sistema SAP
				</Form.Label>
				<Col md="8" >
					<Form.Control as="select" defaultValue={K.PRODUCCION ? 'P01' : 'T01'} ref={refSap}>
						{OPCIONES_SAP.map((opt, i) => {
							return <option key={i} value={opt.value}>{opt.label}</option>
						})}
					</Form.Control>
				</Col>
			</Form.Group>
		</>}
	</>)

	if (resultado.cargando) {
		body = <Alert variant="primary">
			<Spinner />
		</Alert>
	} else {
		if (resultado.error) {
			body = <>
				{formulario}
				<Alert variant="danger">
					<Alert.Heading>
						ERROR
					</Alert.Heading>
					{JSON.stringify(resultado.error)}
				</Alert>
			</>
		} else if (resultado.datos) {
			let ctxId = resultado.datos.data?.ctxId
			body = (
				<Alert variant="success">
					<Alert.Heading>Pedido retransmitido</Alert.Heading>
					{ctxId && <>Se ha generado una nueva transmisión con ID <LinkContainer to={`/transmisiones/${ctxId}`}><Alert.Link>{ctxId}</Alert.Link></LinkContainer></>}
				</Alert>
			)


		} else {
			body = formulario
		}
	}


	return (
		<div className="ContenedorBotonRetransmitir">

			<Button className="rounded-circle p-0" style={{
				width: '60px',
				height: '60px'
			}} onClick={() => setMostar(true)}>
				<Icono icono={FaRetweet} posicion={[30, 0]} />
			</Button>

			<Modal size="lg" show={mostrar} onHide={ocultarModal} aria-labelledby="example-modal-sizes-title-lg" >
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-lg">
						Retransmitir pedido
          		</Modal.Title>
				</Modal.Header>
				<Modal.Body className="pb-0">
					{body}
				</Modal.Body>
				<Modal.Footer>
					{!resultado.datos ? <>
						<Button variant="secondary" onClick={ocultarModal} disabled={resultado.cargando}>
							<Icono icono={MdClose} posicion={[20, 3]} /> Cancelar
          				</Button>
						<Button variant="danger" onClick={retransmitirPedido} disabled={resultado.cargando}>
							<Icono icono={FaRetweet} posicion={[20, 3]} /> Retransmitir
          				</Button>
					</>
						:
						<Button variant="primary" onClick={ocultarModal} disabled={resultado.cargando}>
							<Icono icono={MdClose} posicion={[20, 3]} /> Cerrar
          				</Button>
					}

				</Modal.Footer>
			</Modal>

		</div>
	)
}



export default BotonRetransmitir