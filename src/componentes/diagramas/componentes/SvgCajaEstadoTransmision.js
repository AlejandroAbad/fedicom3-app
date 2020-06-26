import React from 'react';
import Variantes from './variantes';
import './diagramas.scss';

const SvgCajaEstadoTransmision = ({
	ancho, alto, borde, fuente,
	x, y,
	texto,
	cantidad,
	color,
	lineaOrigen
}) => {

	fuente = fuente || 14;
	let anchoCaja = ancho || 150;
	let altoCaja = alto || 60;
	let bordeCaja = borde || 4;

	let fgColor = Variantes.fg(color);
	let bgColor = Variantes.bg(color);

	let linea = null;
	if (lineaOrigen) {
		let [lineaX, lineaY, lineaAncho] = lineaOrigen;
		if (!lineaAncho) lineaAncho = bordeCaja;

		let baseY = Math.round(y + (altoCaja / 2) - (lineaAncho / 2) + (bordeCaja / 2));
		linea = (<>
			{lineaX && <line className="lineaAnimada"
				x1={x} x2={x - lineaX - (lineaAncho / 2)}
				y1={baseY} y2={baseY}
				strokeWidth={lineaAncho} stroke={fgColor} />}
			{lineaY && <line className="lineaAnimada"
				x1={x - lineaX} x2={x - lineaX}
				y1={baseY - lineaAncho / 2} y2={baseY - lineaY + lineaAncho / 2}
				strokeWidth={lineaAncho} stroke={fgColor} />}
		</>);
	}

	let centroX = Math.round(x + (anchoCaja / 2));

	return (<>
		{linea}
		<g opacity={1}>
			<title>{texto.replace('|', ' ')}</title>
			<rect rx="1" id="svg_2" height={altoCaja} width={anchoCaja} x={x} y={y} strokeWidth={bordeCaja} stroke={fgColor} fill={bgColor} />
			<text fontWeight="" fontFamily="Consolas, monospace" fontSize={fuente} x={centroX - (texto.length * 4.2)} y={y + (altoCaja * 0.42)}>{texto}</text>
			<text fontWeight="bold" fontFamily="Consolas, monospace" fontSize={fuente+2} x={centroX - ((cantidad + '').length * 4.6)} y={y + (altoCaja * 0.72)}>{cantidad}</text>
		</g>
	</>
	)

}


export default SvgCajaEstadoTransmision;