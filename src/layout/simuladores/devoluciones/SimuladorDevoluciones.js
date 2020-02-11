import K from 'K'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import fedicomFetch from 'util/fedicomFetch'
import { Container, Col, Row, Button } from 'react-bootstrap'

import SelectorDeAutenticacion from './SelectorDeAutenticacion'
import useStateLocalStorage from 'util/useStateLocalStorage';
import DatosDevolucion from './DatosDevolucion';
import BotonVariantes from './BotonVariantes';
import clone from 'clone'
import ReactJson from 'react-json-view'
import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi'
//import ResultadoSimulacionPedido from './ResultadoSimulacionPedido'

const generarTramaDevolucion = (valores) => {
	let devolucion = clone(valores)
	
	devolucion.authReq = { domain: devolucion.auth.dominio }

	switch (devolucion.auth.dominio) {
		case 'FEDICOM':
			devolucion.authReq.username = devolucion.auth.usuario + '@hefame'
			break;
		default:
			devolucion.authReq.username = devolucion.auth.dominio
			break;
	}

	if (devolucion.codigoCliente === "") delete devolucion.codigoCliente;
	if (devolucion.observaciones === "") delete devolucion.observaciones;

	devolucion.lineas.forEach( (linea) => {
		if (linea.codigoMotivo === "") delete linea.codigoMotivo;
		if (linea.codigoArticulo === "") delete linea.codigoArticulo;
		if (linea.cantidad === "") delete linea.cantidad;
		else if (linea.cantidad != null) linea.cantidad = parseInt(linea.cantidad)
		if (linea.numeroAlbaran === "") delete linea.numeroAlbaran;
		if (linea.fechaAlbaran === "") delete linea.fechaAlbaran;
		if (linea.lote === "") delete linea.lote;
		if (linea.fechaCaducidad === "") delete linea.fechaCaducidad;
		if (linea.valeEstupefaciente === "") delete linea.valeEstupefaciente;
	})

	delete devolucion.auth
	return devolucion
}

const SimuladorDevoluciones = ({ jwt }) => {

	const hookFormulario = useForm();
	const [valoresDevolucion, setValoresDevolucion] = useStateLocalStorage('simulador.devoluciones', null, true);

	const [resultado, setResultado] = useState({ query: null, respuesta: null, datos: null, error: null, cargando: false })


	const devolverCohete = (valores) => {
		setValoresDevolucion(valores);


		let devolucion = generarTramaDevolucion(valores)

		setResultado({ query: devolucion, respuesta: null, datos: null, error: null, cargando: true });

		fedicomFetch(K.DESTINOS.CORE + '/devoluciones', { method: 'POST' }, jwt, devolucion)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ query: devolucion, respuesta: response, datos: response.body, error: null, cargando: false });
					} else {
						setResultado({ query: devolucion, respuesta: response, datos: null, error: response.body, cargando: false });
					}
				}

			})
			.catch(error => {
				setResultado({ query: devolucion, respuesta: null, datos: null, error, cargando: false });
			})
	}

	const establecerVariante = (variante) => {
		setValoresDevolucion(variante)
		window.location.reload();
	}


	return <Container>
		<h4 className="border-bottom pb-2">
			Simulador de devoluciones
			<BotonVariantes establecerVariante={establecerVariante} />
		</h4>

		<SelectorDeAutenticacion valorActual={valoresDevolucion} {...hookFormulario} />
		<DatosDevolucion valorActual={valoresDevolucion} {...hookFormulario} />

		<Row className="mt-3">
			<Col xs={12} className="text-center">
				<Button size="lg" variant="info" disabled={resultado.cargando} onClick={hookFormulario.handleSubmit(devolverCohete)}>Devolver cohete</Button>
			</Col>
		</Row>

		<DepuradorAPI id="simDev" query={resultado.query} resultado={resultado}/>
		


	</Container>

}






export default SimuladorDevoluciones