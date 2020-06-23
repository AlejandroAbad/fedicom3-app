import React from 'react';
import Variantes from './variantes';


const Linea = ({ x, y, variante, resaltar }) => {
	let fgColor = Variantes.fg(variante)

	return (
		<line opacity={resaltar ? 1 : 0.6} x1={x} x2={x + 100} y1={y} y2={y} strokeWidth="4" stroke={fgColor} />
	)
}


export default Linea;