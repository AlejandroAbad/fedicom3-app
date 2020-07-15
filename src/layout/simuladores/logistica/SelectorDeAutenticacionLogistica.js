import React, { useState, useEffect } from 'react'
import { Row, Col, Form, InputGroup, FormControl } from 'react-bootstrap'

import Icono from 'componentes/icono/Icono'

import { FaClinicMedical, FaSkullCrossbones } from 'react-icons/fa'
import { useCampoFormulario, CampoFormulario } from '../CampoFormulario'


const getIconoDeDominio = (dominio) => {
	switch (dominio) {
		case "FEDICOM": return FaClinicMedical;
		case "PORTAL_HEFAME": return FaSkullCrossbones;
		default: return FaClinicMedical;
	}
}


const SelectorDeAutenticacionLogistica = ({ hookFormulario }) => {

	const [dominio, setDominio] = useCampoFormulario('simuladorLogistica.auth.dominio', hookFormulario, 'FEDICOM');

	let selector = (
		<InputGroup className="my-2 col-md-7 col-lg-5">
			<InputGroup.Prepend>
				<InputGroup.Text><Icono icono={getIconoDeDominio(dominio)} posicion={[16]} /></InputGroup.Text>
			</InputGroup.Prepend>
			<Form.Control size="sm" id="selectorDominio" as="select" value={dominio} onChange={(e) => { setDominio(e.target.value) }}>
				<option value="FEDICOM">Un programa de farmacia</option>
				<option value="PORTAL_HEFAME">Portal HEFAME</option>
			</Form.Control>
		</InputGroup>
	)

	let camposExtra = null;
	switch (dominio) {
		case "FEDICOM":
			camposExtra = <ExtraFedicom hookFormulario={hookFormulario} />
			break;
		default:
	}

	return <>

		<CampoFormulario titulo="Emisor" notas={null} >
			<Row>
					{selector}

					{camposExtra}
			</Row>
		</CampoFormulario>

	</>

}



const ExtraFedicom = ({ hookFormulario }) => {

	const [usuario, setUsuario] = useCampoFormulario('simuladorLogistica.auth.usuario', hookFormulario);

	return (
		<InputGroup as={Col} className="my-2 col-md-9 col-lg-6">
				<FormControl size="sm" placeholder="Usuario (YVCLIENTES_FEDI)" defaultValue={usuario} onBlur={(e) => { setUsuario(e.target.value) }} className="text-center" />
				<InputGroup.Append>
					<InputGroup.Text className="form-control-sm" style={{ fontSize: '14px' }} >@hefame</InputGroup.Text>
				</InputGroup.Append>
		</InputGroup>
	)
}



export default SelectorDeAutenticacionLogistica