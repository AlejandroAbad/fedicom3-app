import React from 'react';
import Variantes from './variantes';

const Caja = ({ variante, texto, x, y, resaltar }) => {

	let textos = texto.split('|')
	let bgColor = Variantes.bg(variante);
	let fgColor = Variantes.fg(variante);
	return (
		<g opacity={resaltar ? 1 : 0.6}>
			<title>{texto.replace('|', ' ')}</title>
			<rect rx="3" id="svg_2" height="50" width="130" x={x} y={y} strokeWidth={resaltar ? 5 : 2} stroke={fgColor} fill={bgColor} />
			<text fontWeight="bold" fontFamily="Consolas, monospace" fontSize="16" id="svg_3" x={x + 66 - (textos[0].length * 4.5)} y={y + (textos[1] ? 21 : 31)}>{textos[0]}</text>
			{textos[1] && <text fontWeight="bold" fontFamily="Consolas, monospace" fontSize="16" id="svg_3" x={x + 65 - (textos[1].length * 4.5)} y={y + 41}>{textos[1]}</text>}
			{textos[2] && <text fontWeight="bold" fontFamily="Consolas, monospace" fontSize="16" id="svg_3" x={x + 65 - (textos[2].length * 4.5)} y={y + 82}>{textos[2]}</text>}
		</g>
	)
}


export default Caja;