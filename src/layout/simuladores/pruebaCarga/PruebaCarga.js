import K from 'K'
import React, { useState, useEffect, useCallback } from 'react'
import { Container, Button } from 'react-bootstrap'

import fedicomFetch from 'util/fedicomFetch';
import ReactJson from 'react-json-view';


const CODIGO_CLIENTE = '4999';
const CODIGO_AUTENTICACION = '10104999@hefame';


const LINEAS = [
	{
		"codigoArticulo": "8470000018596",
		"cantidad": 3,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470000048821",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470000070730",
		"cantidad": 2,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470000334993",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001463166",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001527295",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001529251",
		"cantidad": 24,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001529275",
		"cantidad": 3,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001529282",
		"cantidad": 4,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001529299",
		"cantidad": 4,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001529312",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001548450",
		"cantidad": 2,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001571694",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001571700",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001582676",
		"cantidad": 5,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001583161",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001583178",
		"cantidad": 2,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001651365",
		"cantidad": 3,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001651372",
		"cantidad": 3,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001651389",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001659491",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001725370",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001730442",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001733214",
		"cantidad": 2,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001740755",
		"cantidad": 2,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001775115",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001789969",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001790644",
		"cantidad": 3,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001924155",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470001954497",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470002998834",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470003231183",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470004178654",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470004698091",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470004716726",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470004822991",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470004823158",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006590652",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006592816",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006597149",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006617533",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006620397",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006620823",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006643983",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006649282",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006695159",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006719954",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006732441",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006777091",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006821206",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006856284",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006897867",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470006992647",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007005384",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007006688",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007019121",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007019176",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007026839",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007031949",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007045571",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007050469",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007091554",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007128748",
		"cantidad": 5,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007216056",
		"cantidad": 3,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007230984",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007239444",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007250289",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007295662",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007316794",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007452812",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007581512",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470007905271",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470008224944",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470008404889",
		"cantidad": 2,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470008532186",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470008669479",
		"cantidad": 2,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470008822096",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470008879762",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470009116934",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470009158842",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470009160074",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470009617639",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470009772987",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	},
	{
		"codigoArticulo": "8470009986254",
		"cantidad": 1,
		"servicioDemorado": false,
		"fechaLimiteServicio": ""
	}
];


const LINEAS_TRANSFER = [
	{
		"codigoArticulo": "8470002031364",
		"cantidad": 1,
		"servicioDemorado": false,
		"orden": 1
	},
	{
		"codigoArticulo": "8470002358461",
		"cantidad": 1,
		"servicioDemorado": false,
		"orden": 2
	},
	{
		"codigoArticulo": "8470006545720",
		"cantidad": 2,
		"servicioDemorado": false,
		"orden": 3
	},
	{
		"codigoArticulo": "8470006548479",
		"cantidad": 3,
		"servicioDemorado": false,
		"orden": 4
	},
	{
		"codigoArticulo": "8470006621974",
		"cantidad": 1,
		"servicioDemorado": false,
		"orden": 5
	},
	{
		"codigoArticulo": "8470007216162",
		"cantidad": 2,
		"servicioDemorado": false,
		"orden": 6
	},
	{
		"codigoArticulo": "8470008013241",
		"cantidad": 1,
		"servicioDemorado": false,
		"orden": 7
	},
	{
		"codigoArticulo": "8470009385484",
		"cantidad": 1,
		"servicioDemorado": false,
		"orden": 8
	}
];



const generarTramaPedido = (transfer) => {
	let trama = {
		codigoCliente: CODIGO_CLIENTE,
		numeroPedidoOrigen: 'CARGA' + Math.ceil(Math.random() * 100000) + '-' + Math.ceil(Math.random() * 100000),
		authReq: {
			username: CODIGO_AUTENTICACION,
			domain: 'FEDICOM'
		}
	}



	if (transfer) {
		let numLineas = Math.max(1, Math.floor(LINEAS_TRANSFER.length * Math.random()));
		trama.tipoPedido = '000099';
		trama.lineas = LINEAS_TRANSFER.slice(0, numLineas);
	} else {
		let numLineas = Math.max(1, Math.floor(LINEAS.length * Math.random()));
		trama.lineas = LINEAS.slice(0, numLineas);
	}


	return trama;

}




const PruebaCarga = ({ jwt }) => {

	const [resultado, setResultado] = useState({ fallos: 0, ok: 0, tiempo: 0, lineas: 0, tiempoTotal: 0, mediaTiempos: 0 })
	const [arrancado, setArrancado] = useState(false);

	const lanzarCohete = useCallback(() => {
		
		let hacerTransfer = Math.random() <= 0.01;

		let pedido = generarTramaPedido(hacerTransfer)

		let tiempoInicio = (new Date()).getTime();
		fedicomFetch(K.DESTINOS.CORE + '/pedidos', { method: 'POST' }, jwt, pedido)
			.then(response => {
				let tiempoTranscurrido = (new Date()).getTime() - tiempoInicio;

				if (response?.ok && response?.body?.numeroPedido) {
					setResultado({ 
						fallos: resultado.fallos, 
						ok: resultado.ok + 1, 
						tiempo: tiempoTranscurrido, 
						lineas: pedido.lineas.length,
						tiempoTotal: resultado.tiempoTotal + tiempoTranscurrido,
						mediaTiempos: (resultado.tiempoTotal + tiempoTranscurrido) / (resultado.fallos + resultado.ok + 1)
					 });
				} else {
					console.log('No se obtuvo respuesta con numero de pedido', pedido.numeroPedidoOrigen)
					setResultado({
						fallos: resultado.fallos + 1,
						ok: resultado.ok,
						tiempo: tiempoTranscurrido,
						lineas: pedido.lineas.length,
						tiempoTotal: resultado.tiempoTotal + tiempoTranscurrido,
						mediaTiempos: (resultado.tiempoTotal + tiempoTranscurrido) / (resultado.fallos + resultado.ok + 1)
					});
				}
			})
			.catch(error => {
				let tiempoTranscurrido = (new Date()).getTime() - tiempoInicio;
				console.log(error, pedido.numeroPedidoOrigen);
				setResultado({
					fallos: resultado.fallos + 1,
					ok: resultado.ok,
					tiempo: tiempoTranscurrido,
					lineas: pedido.lineas.length,
					tiempoTotal: resultado.tiempoTotal + tiempoTranscurrido,
					mediaTiempos: (resultado.tiempoTotal + tiempoTranscurrido) / (resultado.fallos + resultado.ok + 1)
				});
			})
	}, [resultado, jwt])


	useEffect( () => {
		if (arrancado) lanzarCohete();
	}, [resultado, arrancado, lanzarCohete])


	const arranqueParada = () => {
		setArrancado(!arrancado);
	}



	let cosas = {
		ok: resultado.ok,
		fallos: resultado.fallos,
		ultimoTiempo: resultado.tiempo,
		mediaTiempos: resultado.mediaTiempos
	}


	let boton = null;

	if (arrancado) {
		boton = <Button variant='danger' onClick={arranqueParada}> ECHA EL FRENO </Button>
	} else {
		boton = <Button variant='success' onClick={arranqueParada}> ARRANCA LA MOTO </Button>
	}
	

	return <Container>
		<h4 className="border-bottom pb-2">
			Prueba de carga
		</h4>
		
		<ReactJson src={cosas} />
		{boton}




	</Container>

}






export default PruebaCarga