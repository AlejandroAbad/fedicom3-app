import React, { useState, useEffect } from 'react'
import { Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap'

import Icono from 'componentes/icono/Icono'

import { FaClinicMedical, FaSkullCrossbones } from 'react-icons/fa'


const getIconoDeDominio = (dominio) => {
	switch (dominio) {
		case "FEDICOM": return FaClinicMedical;
		case "PORTAL_HEFAME": return FaSkullCrossbones;
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
					<option value="PORTAL_HEFAME">Portal HEFAME</option>
				</Form.Control>
			</InputGroup>
		</Col>
	)

	let extra = null;
	switch (dominio) {
		case "FEDICOM":
			extra = <ExtraFedicom  {...props} />
			break;
		default:
	}

	return <>
		<Form.Group as={Row} className="align-items-center">
			<Form.Label column md={4} lg={3}>
				Emisor
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



export default SelectorDeAutenticacion