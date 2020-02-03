import React from 'react'
import { Container } from 'react-bootstrap'

//import Icono from 'componentes/icono/Icono'

import SelectorDeAutenticacion from './SelectorDeAutenticacion'

const SimuladorPedidos = ({jwt}) => {
	return <Container>
		<h4>Simulador de pedidos</h4>

		<SelectorDeAutenticacion />
	</Container>

}




export default SimuladorPedidos