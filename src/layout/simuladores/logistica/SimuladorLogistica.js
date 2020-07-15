import React, { useContext } from 'react'
import ContextoAplicacion from 'contexto'
import { useApiSimulador } from 'hooks/useApiMonitor'
import useStateLocalStorage from 'util/useStateLocalStorage'

import { useForm } from 'react-hook-form'
import { Container, Col, Row, Button } from 'react-bootstrap'
import BotonVariantes from './BotonVariantes'

import ResultadoLlamadaApi from 'componentes/resultadoLlamadaApi/ResultadoLlamadaApi'
import clone from 'clone'
import FormularioPedidoLogistica from './FormularioPedidoLogistica'


const PEDIDO_EJEMPLO = {
	authReq: {
		username: '10104999@hefame',
		domain: 'FEDICOM'
	},
	"origen": {
		"codigo": "10104999"
	},
	"destino": {
		"codigo": "LI00000003"
	},
	"lineas": [
		{
			"orden": 1,
			"cantidad": 1,
			"observaciones": "Marihuana",
			"codigoArticulo": "F99001"
		},
		{
			"orden": 2,
			"cantidad": 1,
			"observaciones": "Fardo coca",
			"codigoArticulo": "F99001"
		}
	],
	"observaciones": "A/A de D. Pablo Escobar",
	"numeroLogistica": "6000000016",
	"codigoCliente": "10104999",
	"numeroLogisticaOrigen": "132323-c4d5-44b3-b2cb-4ca65652212",
	"tipoLogistica": "I",
	"fechaLogistica": "2020-07-13"
}


const generarPedidoLogistica = (valoresFormulario) => {
	
	console.log(valoresFormulario);

	let pedido = clone(PEDIDO_EJEMPLO);
	pedido.authReq = { domain: valoresFormulario.auth.dominio }
	switch (valoresFormulario.auth.dominio) {
		case 'FEDICOM':
			pedido.authReq.username = valoresFormulario.auth.usuario + '@hefame'
			break;
		default:
			pedido.authReq.username = valoresFormulario.auth.dominio
			break;
	}

	return pedido;
}


const SimuladorLogistica = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const hookFormulario = useForm();
	const { resultado, ejecutarSimulacion } = useApiSimulador('/logistica', jwt, { method: 'POST' });
	


	const lanzarSimulacionLogistica = (valoresFormulario) => {
		console.log('lanzarSimulacionLogistica', 'valoresFormulario', valoresFormulario.simuladorLogistica)
		let pedido = generarPedidoLogistica(valoresFormulario.simuladorLogistica);
		ejecutarSimulacion({ body: pedido });
	};
	

	return <Container>

		<FormularioPedidoLogistica hookFormulario={hookFormulario} habilitado={!resultado.cargando} onSimular={lanzarSimulacionLogistica} />
		<ResultadoLlamadaApi id="simuladorLogistica" resultado={resultado} />

	</Container>

}






export default SimuladorLogistica