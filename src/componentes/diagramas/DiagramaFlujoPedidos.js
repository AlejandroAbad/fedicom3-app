import React from 'react';
import Variantes from './componentes/variantes';
import EstadoConsulta from 'componentes/estadoConsulta/EstadoConsulta';


import './componentes/diagramas.scss';
import SvgCajaEstadoTransmision from './componentes/SvgCajaEstadoTransmision';


const DiagramaFlujoPedidos = ({ estado }) => {
	if (!estado) return null;

	const { datos/*, error, cargando*/ } = estado;

	if (!datos || !datos.forEach || !datos.length) {
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


	const X_OFFSET = 140;
	const Y_OFFSET = 60;
	const Y_BASE = 1;
	const X_BASE = 40;

	const ANCHO_CAJA = 120;
	const ALTO_CAJA = 50;
	const BORDE_CAJA = 2;
	const FUENTE_CAJA = 14;

	let xBase = X_BASE;
	let yBase = Y_BASE;

	return (
		<svg width="724px" height="175px" xmlns="http://www.w3.org/2000/svg">


			<SvgCajaEstadoTransmision
				ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
				x={xBase} y={yBase}
				texto={`RECEPCIONADO`} cantidad={acumulador.RECEPCIONADO} color='primary'
				lineaOrigen={[30, 0, BORDE_CAJA]} />

			{acumulador.PETICION_INCORRECTA && <>
				{yBase += Y_OFFSET}
				<SvgCajaEstadoTransmision
					ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
					x={xBase} y={yBase}
					texto={`INCORRECTO`} cantidad={acumulador.PETICION_INCORRECTA} color='warning'
					lineaOrigen={[20, Y_OFFSET, BORDE_CAJA]} />
			</>}

			{acumulador.FALLO_AUTENTICACION && <>
				{yBase += Y_OFFSET}
				<SvgCajaEstadoTransmision
					ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
					x={xBase} y={yBase}
					texto={`FALLO AUTH`} cantidad={acumulador.FALLO_AUTENTICACION} color='info'
					lineaOrigen={[20, Y_OFFSET, BORDE_CAJA]} />
			</>}


			{xBase += X_OFFSET}
			{yBase = Y_BASE}
			<SvgCajaEstadoTransmision
				ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
				x={xBase} y={yBase}
				texto={`EN SAP`} cantidad={acumulador.ESPERANDO_INCIDENCIAS} color='primary'
				lineaOrigen={[20, 0, BORDE_CAJA]} />


			{xBase += X_OFFSET}
			{yBase = Y_BASE}
			<SvgCajaEstadoTransmision
				ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
				x={xBase} y={yBase}
				texto={`RECIBIDO SAP`} cantidad={acumulador.INCIDENCIAS_RECIBIDAS} color='primary'
				lineaOrigen={[20, 0, BORDE_CAJA]} />
			{acumulador.RECHAZADO_SAP && <>
				{yBase += Y_OFFSET}
				<SvgCajaEstadoTransmision
					ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
					x={xBase} y={yBase}
					texto={`RECHAZADO SAP`} cantidad={acumulador.RECHAZADO_SAP} color='info'
					lineaOrigen={[10, Y_OFFSET, BORDE_CAJA]} />
			</>}
			{acumulador.NO_SAP && <>
				{yBase += Y_OFFSET}
				<SvgCajaEstadoTransmision
					ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
					x={xBase} y={yBase}
					texto={`NO SAP`} cantidad={acumulador.NO_SAP} color='danger'
					lineaOrigen={[10, Y_OFFSET, BORDE_CAJA]} />
			</>}


			{xBase += X_OFFSET}
			{yBase = Y_BASE}
			<SvgCajaEstadoTransmision
				ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
				x={xBase} y={yBase}
				texto={`RESPONDIDO`} cantidad={acumulador.ESPERANDO_NUMERO_PEDIDO} color='success'
				lineaOrigen={[20, 0, BORDE_CAJA]} />





			{xBase += X_OFFSET}
			{yBase = Y_BASE}
			<SvgCajaEstadoTransmision
				ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
				x={xBase} y={yBase}
				texto={`CONFIRMADO`} cantidad={acumulador.OK} color='success'
				lineaOrigen={[20, 0, BORDE_CAJA]} />
			{acumulador.ESPERA_AGOTADA && <>
				{yBase += Y_OFFSET}
				<SvgCajaEstadoTransmision
					ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
					x={xBase} y={yBase}
					texto={`ESPERA AGOTADA`} cantidad={acumulador.ESPERA_AGOTADA} color='danger'
					lineaOrigen={[10, Y_OFFSET, BORDE_CAJA]} />
			</>}
			{acumulador.SIN_NUMERO_PEDIDO_SAP && <>
				{yBase += Y_OFFSET}
				<SvgCajaEstadoTransmision
					ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
					x={xBase} y={yBase}
					texto={`SIN PEDIDO`} cantidad={acumulador.SIN_NUMERO_PEDIDO_SAP} color='danger'
					lineaOrigen={[10, Y_OFFSET, BORDE_CAJA]} />
			</>}


			<polygon points="2,18 19,26 2,34" style={{ fill: Variantes.bg('success'), stroke: Variantes.fg('success'), strokeWidth: 2 }} />
		</svg>
	)
}



export default DiagramaFlujoPedidos;