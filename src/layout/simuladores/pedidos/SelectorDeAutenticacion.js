import K from 'K'
import React, { useState, useEffect } from 'react'
import { Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap'

import Icono from 'componentes/icono/Icono'

import { GoPerson } from 'react-icons/go'
import { FaFlask, FaGooglePlusG, FaClinicMedical } from 'react-icons/fa'
import { FiChevronsRight } from 'react-icons/fi'


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
		<Col md={6}>
			<InputGroup className="my-2">
				<InputGroup.Prepend>
					<InputGroup.Text><Icono icono={getIconoDeDominio(dominio)} /></InputGroup.Text>
				</InputGroup.Prepend>
				<Form.Control id="selectorDominio" as="select" value={dominio} onChange={(e) => { setDominio(e.target.value) }}>
					<option value="FEDICOM">Un programa de farmacia</option>
					<option value="TRANSFER">Un transfer de laboratorio</option>
					<option value="EMPLEADO">La aplicación móvil del empleado</option>
					<option value="F+ONLINE">Un servidor F+Online</option>
				</Form.Control>
			</InputGroup>
		</Col>
	)

	let extra = null;
	switch (dominio) {
		case "FEDICOM":
			extra = <ExtraFedicom  {...props} />
			break;
		case "TRANSFER":
			extra = <ExtraLaboratorio {...props} />
			break;
		default:
	}

	return <>
		<Row>
			<Col className="h6 d-inline mt-4 pt-1 bg-success-soft">
				<Icono icono={FiChevronsRight} posicion={[22, 4]} className="text-secondary" /> ¿ Quién realiza el pedido ?
			</Col>
		</Row>
		<Row className="d-flex align-items-end">
			{selector}{extra}
		</Row>
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
		<Col lg={4} md={6}>

			<InputGroup className="my-2">
				<FormControl placeholder="Usuario" defaultValue={usuario} onBlur={(e) => { setUsuario(e.target.value) }} className="text-center" />
				<InputGroup.Append>
					<InputGroup.Text>@hefame</InputGroup.Text>
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
		<Col md={6}>
			<InputGroup className="my-2">
				<InputGroup.Prepend>
					<Form.Control as="select" value={tipoTransfer} onChange={(e) => { setTipoTransfer(e.target.value) }} >
						<option value="TR">TR</option>
						<option value="TG">TG</option>
						<option value="TP">TP</option>
					</Form.Control>
				</InputGroup.Prepend>
				<Form.Control as="select" value={codigoLaboratorio} onChange={(e) => { setCodigoLaboratorio(e.target.value) }} >
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