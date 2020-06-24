import React from 'react';
import Caja from './componentes/Caja';
import Linea from './componentes/Linea';
import Variantes from './componentes/variantes';
import EstadoConsulta from 'componentes/estadoConsulta/EstadoConsulta';



const DiagramaEstadoPedidos = ({ estado }) => {
	if (!estado) return null;

	const { datos, error, cargando } = estado;

	if (cargando || error || !datos || !datos.forEach || !datos.length) {
		return <EstadoConsulta resultado={estado} />
	}

	const acumulador = {
		DESCONOCIDO: 0,
		RECEPCIONADO: 0,
		ESPERANDO_INCIDENCIAS: 0,
		INCIDENCIAS_RECIBIDAS: 0,
		FALLO_AUTENTICACION: 0,
		NO_AUTORIZADO: 0,
		PETICION_INCORRECTA: 0,
		NO_SAP: 0,
		RECHAZADO_SAP: 0,
		OK: 0,
		ESPERANDO_NUMERO_PEDIDO: 0,
		ESPERA_AGOTADA: 0,
		SIN_NUMERO_PEDIDO_SAP: 0,
	}

	/*
		DESCONOCIDO: -1,
		RECEPCIONADO: 1010,
		ESPERANDO_INCIDENCIAS: 1020,
		INCIDENCIAS_RECIBIDAS: 1030,
		FALLO_AUTENTICACION: 3010,
		NO_AUTORIZADO: 3011,
		PETICION_INCORRECTA: 3020,
		NO_SAP: 3110,
		RECHAZADO_SAP: 3120,
		OK: 9900,
		ESPERANDO_NUMERO_PEDIDO: 8010,
		ESPERA_AGOTADA: 8100,
		SIN_NUMERO_PEDIDO_SAP: 9140,
	*/
	datos.forEach(estado => {
		switch (estado._id) {
			case 1010: return acumulador.RECEPCIONADO += estado.transmisiones;
			case 1020: return acumulador.ESPERANDO_INCIDENCIAS += estado.transmisiones;
			case 1030: return acumulador.INCIDENCIAS_RECIBIDAS += estado.transmisiones;
			case 3010: return acumulador.FALLO_AUTENTICACION += estado.transmisiones;
			case 3011: return acumulador.NO_AUTORIZADO += estado.transmisiones;
			case 3020: return acumulador.PETICION_INCORRECTA += estado.transmisiones;
			case 3110: return acumulador.NO_SAP += estado.transmisiones;
			case 3120: return acumulador.RECHAZADO_SAP += estado.transmisiones;
			case 9900: return acumulador.OK += estado.transmisiones;
			case 8010: return acumulador.ESPERANDO_NUMERO_PEDIDO += estado.transmisiones;
			case 8100: return acumulador.ESPERA_AGOTADA += estado.transmisiones;
			case 9140: return acumulador.SIN_NUMERO_PEDIDO_SAP += estado.transmisiones;
			default: return acumulador.DESCONOCIDO += estado.transmisiones;
		}
	})




	let xOffset = 80

	return (
		<svg viewBox='0 0 1140 263' preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">

			<Linea x={-20} y={65} variante='primary' resaltar />
			<Caja texto={`RECEPCIONADO|` + acumulador.RECEPCIONADO} x={xOffset} y={40} variante='primary' resaltar={acumulador.RECEPCIONADO} />
			<LineaError x={xOffset - 30} y={65} alto={60} ancho={30} variante='secondary' resaltar={false} />
			<Caja texto={`FALLO AUTH|` + acumulador.FALLO_AUTENTICACION} x={xOffset} y={100} variante='secondary' resaltar={acumulador.FALLO_AUTENTICACION} />
			<LineaError x={xOffset - 50} y={65} alto={120} ancho={50} variante='secondary' resaltar={false} />
			<Caja texto={`INCORRECTO|` + acumulador.PETICION_INCORRECTA} x={xOffset} y={160} variante='secondary' resaltar={acumulador.PETICION_INCORRECTA} />


			<Linea x={xOffset + 130} y={65} variante='primary' resaltar />
			{xOffset += 230}
			<Caja texto={`ENVIADO SAP|` + acumulador.ESPERANDO_INCIDENCIAS} x={xOffset} y={40} variante='primary' resaltar={acumulador.ESPERANDO_INCIDENCIAS} />


			<Linea x={xOffset + 130} y={65} variante='primary' resaltar />
			{xOffset += 230}
			<Caja texto={`RECIBIDO SAP|` + acumulador.INCIDENCIAS_RECIBIDAS} x={xOffset} y={40} variante='primary' resaltar={acumulador.INCIDENCIAS_RECIBIDAS} />
			<LineaError x={xOffset - 30} y={65} alto={60} ancho={30} variante='warning' />
			<Caja texto={`RECHAZADO SAP|` + acumulador.RECHAZADO_SAP} x={xOffset} y={100} variante='warning' resaltar={acumulador.RECHAZADO_SAP} />
			<LineaError x={xOffset - 70} y={65} alto={120} ancho={70} variante='danger' />
			<Caja texto={`NO SAP|` + acumulador.NO_SAP} x={xOffset} y={160} variante='danger' resaltar={acumulador.NO_SAP} />


			<Linea x={xOffset + 130} y={65} variante='primary' resaltar />
			{xOffset += 230}
			<Caja texto={`RESPONDIDO|` + acumulador.ESPERANDO_NUMERO_PEDIDO} x={xOffset} y={40} variante='success' resaltar={acumulador.ESPERANDO_NUMERO_PEDIDO} />



			<Linea x={xOffset + 130} y={65} variante='primary' resaltar />
			{xOffset += 230}
			<Caja texto={`CONFIRMADO|` + acumulador.OK} x={xOffset} y={40} variante='success' resaltar={acumulador.OK} />

			<LineaError x={xOffset - 30} y={65} alto={60} ancho={30} variante='danger' />
			<Caja texto={`TIMEOUT|` + acumulador.ESPERA_AGOTADA} x={xOffset} y={100} variante='danger' resaltar={acumulador.ESPERA_AGOTADA} />

			<LineaError x={xOffset - 70} y={65} alto={120} ancho={70} variante='danger' />
			<Caja texto={`NO PEDIDO SAP|` + acumulador.SIN_NUMERO_PEDIDO_SAP} x={xOffset} y={160} variante='danger' resaltar={acumulador.SIN_NUMERO_PEDIDO_SAP} />


			<polygon points="0,50 15,65 0,80" />
		</svg>
	)
}


const LineaError = ({ x, y, alto, ancho, variante }) => {
	let fgColor = Variantes.fg(variante);
	return (<>
		<line x1={x} x2={x} y1={y + 2} y2={y + alto + 2} strokeWidth="4" stroke={fgColor} />
		<line x1={x} x2={x + ancho} y1={y + alto} y2={y + alto} strokeWidth="4" stroke={fgColor} />
	</>)
}


export default DiagramaEstadoPedidos;