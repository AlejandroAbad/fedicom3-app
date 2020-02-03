import React, { useState } from 'react'
import { Row, Col, Form, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap'

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


const SelectorDeAutenticacion = ({ a }) => {

	const [dominio, setDominio] = useState("FEDICOM")

	let selector = (
		<Col md={6}>
			<label htmlFor="basic-url">¿ Quien realiza el pedido ?</label>
			<InputGroup className="mb-3">
				<InputGroup.Prepend>
					<InputGroup.Text id="input-password"><Icono icono={getIconoDeDominio(dominio)} /></InputGroup.Text>
				</InputGroup.Prepend>
				<Form.Control as="select" value={dominio} onChange={(e) => { setDominio(e.target.value) }}>
					<option value="FEDICOM">Una farmacia con su programa</option>
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
			extra = <ExtraFedicom />
			break;
		case "TRANSFER":
			extra = <ExtraLaboratorio />
			break;
		default:
	}

	return <Row className="d-flex align-items-end">
		{selector}{extra}
	</Row>

}



const ExtraFedicom = () => {
	return (
		<Col lg={4} md={6}>
			
			<InputGroup className="mb-3">
				<FormControl placeholder="Código usuario"  />
				<InputGroup.Append>
					<InputGroup.Text>@hefame</InputGroup.Text>
				</InputGroup.Append>
			</InputGroup>
		</Col>
	)
}


const ExtraLaboratorio = () => {
	return (
		<Col md={6}>
			<InputGroup className="mb-3">
				<Form.Control as="select" value="" onChange={(e) => {  }} md={3} >
					<option value="FEDICOM">Una farmacia con su programa</option>
					<option value="TRANSFER">Un transfer de laboratorio</option>
					<option value="EMPLEADO">La aplicación móvil del empleado</option>
					<option value="F+ONLINE">Un servidor F+Online</option>
				</Form.Control>

				<Form.Control as="select" value="" onChange={(e) => { }} md={9}>
					<option value="FEDICOM">Una farmacia con su programa</option>
					<option value="TRANSFER">Un transfer de laboratorio</option>
					<option value="EMPLEADO">La aplicación móvil del empleado</option>
					<option value="F+ONLINE">Un servidor F+Online</option>
				</Form.Control>

			</InputGroup>
		</Col>
	)
}


export default SelectorDeAutenticacion