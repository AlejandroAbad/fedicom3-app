import React from 'react'
import { useForm } from 'react-hook-form';

import { Container, Col, Row, Button } from 'react-bootstrap'

//import Icono from 'componentes/icono/Icono'

import SelectorDeAutenticacion from './SelectorDeAutenticacion'
import useStateLocalStorage from 'util/useStateLocalStorage';
import DatosPedido from './DatosPedido';


const SimuladorPedidos = ({ jwt }) => {

	const hookFormulario = useForm();
	const [ valoresPedido, setValoresPedido ] = useStateLocalStorage('simulador.pedidos', null, true);


	const lanzarCohete = (valores) => {
		console.log(valores)

		setValoresPedido(valores);
	}


	return <Container>
		<h4 className="border-bottom pb-2">Simulador de pedidos</h4>

		<SelectorDeAutenticacion valorActual={valoresPedido} {...hookFormulario} />
		<DatosPedido valorActual={valoresPedido} {...hookFormulario} />
		
		<Row className="mt-3">
			<Col xs={12} className="text-center">
				<Button size="lg" onClick={hookFormulario.handleSubmit(lanzarCohete)}>Lanzar cohete</Button>
			</Col>
		</Row>
	</Container>

}




export default SimuladorPedidos