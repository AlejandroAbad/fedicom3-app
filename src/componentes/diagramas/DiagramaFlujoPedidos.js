import React from 'react';
import Variantes from './componentes/variantes';
import EstadoConsulta from 'componentes/estadoConsulta/EstadoConsulta';


import './componentes/diagramas.scss';


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


	const X_OFFSET = 205;
	const Y_OFFSET = 70;
	const Y_BASE = 40;
	const X_BASE = 60;

	let xBase = X_BASE;
	let yBase = Y_BASE;

	return (
		<svg viewBox='0 0 1053 263' preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">


			<SvgContadorEstadoTransmision x={xBase} y={yBase}
				texto={`RECEPCIONADO`} cantidad={acumulador.RECEPCIONADO} color='primary'
				lineaOrigen={[50, 0, 6]} />

			{acumulador.PETICION_INCORRECTA && <>
				{yBase += Y_OFFSET}
				<SvgContadorEstadoTransmision x={xBase} y={yBase}
					texto={`INCORRECTO`} cantidad={acumulador.PETICION_INCORRECTA} color='warning'
					lineaOrigen={[40, Y_OFFSET, 6]} />
			</>}

			{acumulador.FALLO_AUTENTICACION && <>
				{yBase += Y_OFFSET}
				<SvgContadorEstadoTransmision x={xBase} y={yBase}
					texto={`FALLO AUTH`} cantidad={acumulador.FALLO_AUTENTICACION} color='warning'
					lineaOrigen={[40, Y_OFFSET, 6]} />
			</>}



			{xBase += X_OFFSET}
			{yBase = Y_BASE}
			<SvgContadorEstadoTransmision x={xBase} y={yBase}
				texto={`ENVIADO A SAP`} cantidad={acumulador.ESPERANDO_INCIDENCIAS} color='primary'
				lineaOrigen={[50, 0, 6]} />


			{xBase += X_OFFSET}
			{yBase = Y_BASE}
			<SvgContadorEstadoTransmision x={xBase} y={yBase}
				texto={`RECIBIDO DE SAP`} cantidad={acumulador.INCIDENCIAS_RECIBIDAS} color='primary'
				lineaOrigen={[50, 0, 6]} />
			{acumulador.RECHAZADO_SAP && <>
				{yBase += Y_OFFSET}
				<SvgContadorEstadoTransmision x={xBase} y={yBase}
					texto={`RECHAZADO SAP`} cantidad={acumulador.RECHAZADO_SAP} color='warning'
					lineaOrigen={[40, Y_OFFSET, 6]} />
			</>}
			{acumulador.NO_SAP && <>
				{yBase += Y_OFFSET}
				<SvgContadorEstadoTransmision x={xBase} y={yBase}
					texto={`NO SAP`} cantidad={acumulador.NO_SAP} color='danger'
					lineaOrigen={[40, Y_OFFSET, 6]} />
			</>}


			{xBase += X_OFFSET}
			{yBase = Y_BASE}
			<SvgContadorEstadoTransmision x={xBase} y={yBase}
				texto={`RESPONDIDO`} cantidad={acumulador.ESPERANDO_NUMERO_PEDIDO} color='success'
				lineaOrigen={[50, 0, 6]} />





			{xBase += X_OFFSET}
			{yBase = Y_BASE}
			<SvgContadorEstadoTransmision x={xBase} y={yBase}
				texto={`CONFIRMADO`} cantidad={acumulador.OK} color='success'
				lineaOrigen={[50, 0, 6]} />
			{acumulador.ESPERA_AGOTADA && <>
				{yBase += Y_OFFSET}
				<SvgContadorEstadoTransmision x={xBase} y={yBase}
					texto={`ESPERA AGOTADA`} cantidad={acumulador.ESPERA_AGOTADA} color='danger'
					lineaOrigen={[40, Y_OFFSET, 6]} />
			</>}
			{acumulador.SIN_NUMERO_PEDIDO_SAP && <>
				{yBase += Y_OFFSET}
				<SvgContadorEstadoTransmision x={xBase} y={yBase}
					texto={`SIN PEDIDO SAP`} cantidad={acumulador.SIN_NUMERO_PEDIDO_SAP} color='danger'
					lineaOrigen={[40, Y_OFFSET, 6]} />
			</>}


			<polygon points="2,58 27,69 2,80" style={{ fill: Variantes.bg('success'), stroke: Variantes.fg('success'), strokeWidth: 5 }} />
		</svg>
	)
}



const SvgContadorEstadoTransmision = ({
	x, y,
	texto,
	cantidad,
	color,
	lineaOrigen

}) => {


	let anchoCaja = 150;
	let altoCaja = 60;
	let bordeCaja = 4;

	let fgColor = Variantes.fg(color);
	let bgColor = Variantes.bg(color);

	let linea = null;
	if (lineaOrigen) {
		let [lineaX, lineaY, lineaAncho] = lineaOrigen;
		if (!lineaAncho) lineaAncho = bordeCaja;

		let baseY = Math.round(y + (altoCaja / 2) - (lineaAncho / 2) + (bordeCaja / 2));
		linea = (<>
			{lineaX && <line className="lineaAnimada"
				x1={x } x2={x - lineaX - (lineaAncho/2)}
				y1={baseY} y2={baseY}
				strokeWidth={lineaAncho} stroke={fgColor} />}
			{lineaY && <line className="lineaAnimada"
				x1={x - lineaX} x2={x - lineaX}
				y1={baseY - lineaAncho/2} y2={baseY - lineaY + lineaAncho/2}
				strokeWidth={lineaAncho} stroke={fgColor} />}
		</>);
	}

	let centroX = Math.round(x + (anchoCaja / 2));

	return (<>
		{linea}
		<g opacity={1}>
			<title>{texto.replace('|', ' ')}</title>
			<rect rx="1" id="svg_2" height={altoCaja} width={anchoCaja} x={x} y={y} strokeWidth={bordeCaja} stroke={fgColor} fill={bgColor} />
			<text fontWeight="" fontFamily="Consolas, monospace" fontSize="14" x={centroX - (texto.length * 4.2)} y={y + (altoCaja * 0.42)}>{texto}</text>
			<text fontWeight="bold" fontFamily="Consolas, monospace" fontSize="16" x={centroX - ((cantidad + '').length * 4.6)} y={y + (altoCaja * 0.72)}>{cantidad}</text>
		</g>
	</>
	)

}






export default DiagramaFlujoPedidos;