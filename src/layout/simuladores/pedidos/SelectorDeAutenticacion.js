import K from 'K'
import React, { useState, useEffect } from 'react'
import { Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap'

import Icono from 'componentes/icono/Icono'

import { GoPerson } from 'react-icons/go'
import { FaFlask, FaGooglePlusG, FaClinicMedical } from 'react-icons/fa'


const getIconoDeDominio = (dominio) => {
	switch (dominio) {
		case "FEDICOM": return FaClinicMedical;
		case "TRANSFER": return FaFlask;
		case "EMPLEADO": return GoPerson;
		case "F+ONLINE": return FaGooglePlusG;
		default: return FaClinicMedical;
	}
}


const SelectorDeAutenticacion = (props) => {
	const { setValue, register, /*errors,*/ valorActual } = props

	let valorInicial = valorActual?.auth?.dominio ?? "FEDICOM"

	const [dominio, setDominio] = useState(valorInicial)

	useEffect(() => {
		register({ name: 'auth.dominio' })
	}, [register])

	useEffect(() => {
		setValue('auth.dominio', dominio)
	}, [dominio, setValue])


	let selector = (
		<Col lg={4} md={8}>
			<InputGroup className="my-2">
				<InputGroup.Prepend>
					<InputGroup.Text><Icono icono={getIconoDeDominio(dominio)} posicion={[16]}/></InputGroup.Text>
				</InputGroup.Prepend>
				<Form.Control size="sm" id="selectorDominio" as="select" value={dominio} onChange={(e) => { setDominio(e.target.value) }}>
					<option value="FEDICOM">Un programa de farmacia</option>
					<option value="transfer_laboratorio">Un transfer de laboratorio</option>
					<option value="empleado">La aplicación móvil del empleado</option>
					<option value="FMAS">Un servidor F+Online</option>
				</Form.Control>
			</InputGroup>
		</Col>
	)

	let extra = null;
	switch (dominio) {
		case "FEDICOM":
			extra = <ExtraFedicom  {...props} />
			break;
		case "transfer_laboratorio":
			extra = <ExtraLaboratorio {...props} />
			break;
		default:
	}

	return <>
		<Form.Group as={Row} className="align-items-center">
			<Form.Label column md={4} lg={3}>
				Emisor del pedido
			</Form.Label>
				{selector}
				<Col md={4} className="d-none d-md-inline-block d-lg-none text-white">_</Col>
				{extra}
		</Form.Group>
	</>

}



const ExtraFedicom = ({ valorActual, setValue, register, errors }) => {

	let valorUsuarioInicial = valorActual?.auth?.usuario ?? ""

	const [usuario, setUsuario] = useState(valorUsuarioInicial)

	useEffect(() => {
		register({ name: 'auth.usuario' })
	}, [register])

	useEffect(() => {
		setValue('auth.usuario', usuario)
	}, [usuario, setValue])

	return (
		<Col lg={5} md={8}>

			<InputGroup className="my-2">
				<FormControl size="sm"  placeholder="Usuario (YVCLIENTES_FEDI)" defaultValue={usuario} onBlur={(e) => { setUsuario(e.target.value) }} className="text-center" />
				<InputGroup.Append>
					<InputGroup.Text className="form-control-sm" style={{ fontSize: '14px' }} >@hefame</InputGroup.Text>
				</InputGroup.Append>
			</InputGroup>
		</Col>
	)
}


const ExtraLaboratorio = ({ valorActual, setValue, register, errors }) => {

	let valorTipoTransferInicial = valorActual?.auth?.tipoTransfer ?? "TR"
	let valorCodigoLaboratorioInicial = valorActual?.auth?.codigoLaboratorio ?? "602999999"

	const [tipoTransfer, setTipoTransfer] = useState(valorTipoTransferInicial)
	const [codigoLaboratorio, setCodigoLaboratorio] = useState(valorCodigoLaboratorioInicial)


	useEffect(() => {
		register({ name: 'auth.codigoLaboratorio' })
		register({ name: 'auth.tipoTransfer' })
	}, [register])

	useEffect(() => {
		setValue('auth.tipoTransfer', tipoTransfer)
		setValue('auth.codigoLaboratorio', codigoLaboratorio)
	}, [tipoTransfer, codigoLaboratorio, setValue])

	return (
		<Col lg={5} md={8}>
			<InputGroup className="my-2">
				<InputGroup.Prepend>
					<Form.Control size="sm" as="select" value={tipoTransfer} onChange={(e) => { setTipoTransfer(e.target.value) }} >
						<option value="TR">TR</option>
						<option value="TG">TG</option>
						<option value="TP">TP</option>
					</Form.Control>
				</InputGroup.Prepend>
				<Form.Control size="sm" as="select" value={codigoLaboratorio} onChange={(e) => { setCodigoLaboratorio(e.target.value) }} >
					{
						Object.keys(K.LABORATORIOS).map((cod, i) => {
							return <option value={cod} key={i}>{K.LABORATORIOS[cod]} ({cod})</option>
						})
					}
					<option value="602999999">- Laboratorio inventado -</option>
				</Form.Control>
			</InputGroup>
		</Col>
	)
}


export default SelectorDeAutenticacion