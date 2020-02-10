import K from 'K'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import fedicomFetch from 'util/fedicomFetch'
import { Container, Col, Row, Button } from 'react-bootstrap'

import SelectorDeAutenticacion from './SelectorDeAutenticacion'
import useStateLocalStorage from 'util/useStateLocalStorage';
import DatosPedido from './DatosPedido';
import BotonVariantes from './BotonVariantes';
import clone from 'clone'
import ResultadoSimulacionPedido from './ResultadoSimulacionPedido'

const generarTramaPedido = (valores) => {
	let pedido = clone(valores)
	pedido.numeroPedidoOrigen = 'SIMUL' + Math.ceil(Math.random() * 100000)
	pedido.authReq = { domain: pedido.auth.dominio }

	switch (pedido.auth.dominio) {
		case 'FEDICOM':
			pedido.authReq.username = pedido.auth.usuario + '@hefame'
			break;
		case 'transfer_laboratorio':
			pedido.authReq.username = pedido.auth.tipoTransfer + pedido.auth.codigoLaboratorio
			break;
		case 'FMAS':
			pedido.authReq.username = 'F+Online'
			break;
		default:
			pedido.authReq.username = pedido.auth.dominio
			break;
	}

	if (pedido.tipoPedido === "") delete pedido.tipoPedido;
	if (pedido.codigoAlmacenServicio === "") delete pedido.codigoAlmacenServicio;
	if (!pedido.fechaServicio) delete pedido.fechaServicio;
	if (pedido.direccionEnvio === "") delete pedido.direccionEnvio;
	if (pedido.observaciones === "") delete pedido.observaciones;
	if (pedido.aplazamiento === "") delete pedido.aplazamiento;
	else if (pedido.aplazamiento != null) pedido.aplazamiento = parseInt(pedido.aplazamiento)

	pedido.lineas.forEach( (linea) => {
		if (linea.cantidad === "") delete linea.cantidad;
		else if (linea.cantidad != null) linea.cantidad = parseInt(linea.cantidad)

		if (linea.cantidadBonificacion === "") delete linea.cantidadBonificacion;
		else if (linea.cantidadBonificacion != null) linea.cantidadBonificacion = parseInt(linea.cantidadBonificacion)

		if (linea.valeEstupefaciente === "") delete linea.valeEstupefaciente;

		if (linea.descuentoPorcentaje === "") delete linea.descuentoPorcentaje;
		else if (linea.descuentoPorcentaje != null) linea.descuentoPorcentaje = parseFloat(linea.descuentoPorcentaje)
	})

	delete pedido.auth
	return pedido
}

const SimuladorPedidos = ({ jwt }) => {

	const hookFormulario = useForm();
	const [valoresPedido, setValoresPedido] = useStateLocalStorage('simulador.pedidos', null, true);

	const [resultado, setResultado] = useState({ query: null, respuesta: null, datos: null, error: null, cargando: false })


	const lanzarCohete = (valores) => {
		setValoresPedido(valores);


		let pedido = generarTramaPedido(valores)

		setResultado({ query: pedido, respuesta: null, datos: null, error: null, cargando: true });

		fedicomFetch(K.DESTINOS.CORE + '/pedidos', { method: 'POST' }, jwt, pedido)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ query: pedido, respuesta: response, datos: response.body, error: null, cargando: false });
					} else {
						setResultado({ query: pedido, respuesta: response, datos: null, error: response.body, cargando: false });
					}
				}

			})
			.catch(error => {
				setResultado({ query: pedido, respuesta: null, datos: null, error, cargando: false });
			})
	}

	const establecerVariante = (variante) => {
		setValoresPedido(variante)
		window.location.reload();
	}


	return <Container>
		<h4 className="border-bottom pb-2">
			Simulador de pedidos
			<BotonVariantes establecerVariante={establecerVariante} />
		</h4>

		<SelectorDeAutenticacion valorActual={valoresPedido} {...hookFormulario} />
		<DatosPedido valorActual={valoresPedido} {...hookFormulario} />

		<Row className="mt-3">
			<Col xs={12} className="text-center">
				<Button size="lg" disabled={resultado.cargando} onClick={hookFormulario.handleSubmit(lanzarCohete)}>Lanzar cohete</Button>
			</Col>
		</Row>

		<ResultadoSimulacionPedido id="simuladorPedidos" jwt={jwt} resultado={resultado} />


	</Container>

}






export default SimuladorPedidos