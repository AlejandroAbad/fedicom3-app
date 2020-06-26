import React from 'react';

import SvgCajaEstadoTransmision from './componentes/SvgCajaEstadoTransmision';


const DiagramaFlujoDevoluciones = ({ estado }) => {
	if (!estado || !estado.devolucion) return null;

	estado = estado.devolucion;

	const X_OFFSET = 235;
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
		<svg width="423px" height="115px" xmlns="http://www.w3.org/2000/svg" >

			<SvgCajaEstadoTransmision
				ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
				x={xBase} y={yBase}
				texto={`PENDIENTE`} cantidad={estado.error || 0} color='success'
				lineaOrigen={[30, 0, 2]} />

			{xBase += X_OFFSET}
			<SvgCajaEstadoTransmision x={xBase} y={yBase}
				ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
				texto={`ACEPTADA`} cantidad={estado.ok} color='success'
				lineaOrigen={[115, 0, 2]} />
			<SvgCajaEstadoTransmision x={xBase} y={yBase + Y_OFFSET}
				ancho={ANCHO_CAJA} alto={ALTO_CAJA} borde={BORDE_CAJA} fuente={FUENTE_CAJA}
				texto={`RECHAZADA`} cantidad={estado.rechazo} color='warning'
				lineaOrigen={[(ANCHO_CAJA/2) +15, Y_OFFSET, 2]} />
		</svg>
	)
}









export default DiagramaFlujoDevoluciones;