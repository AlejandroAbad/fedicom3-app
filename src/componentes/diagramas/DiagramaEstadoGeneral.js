import React from 'react';



const DiagramaEstadoGeneral = ({ estado }) => {


	return (
		<svg viewBox={`0 0 1140 400`} preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
			<polygon points="0,50 15,65 0,80" />
		</svg >
	)
}

const LineaError = ({ x, y, variante }) => {
	let fgColor = getVarianteFg(variante)
	return (<>
		<line x1={x} x2={x + 52} y1={y} y2={y} strokeWidth="4" stroke={fgColor} />
		<line x1={x + 50} x2={x + 50} y1={y} y2={y + 60} strokeWidth="4" stroke={fgColor} />
		<line x1={x + 48} x2={x + 100} y1={y + 60} y2={y + 60} strokeWidth="4" stroke={fgColor} />
	</>)
}

const Linea = ({ x, y, variante, resaltar }) => {
	let fgColor = getVarianteFg(variante)

	return (
		<line opacity={resaltar ? 1 : 0.6} x1={x} x2={x + 100} y1={y} y2={y} strokeWidth="4" stroke={fgColor} />
	)
}

const Caja = ({ variante, texto, x, y, resaltar }) => {

	let textos = texto.split('|')
	let bgColor = getVarianteBg(variante)
	let fgColor = getVarianteFg(variante)
	return (
		<g opacity={resaltar ? 1 : 0.6}>
			<title>{texto.replace('|', ' ')}</title>
			<rect rx="3" id="svg_2" height="50" width="130" x={x} y={y} strokeWidth={resaltar ? 5 : 2} stroke={fgColor} fill={bgColor} />
			<text fontWeight="bold" fontFamily="Consolas, monospace" fontSize="16" id="svg_3" x={x + 66 - (textos[0].length * 4.5)} y={y + (textos[1] ? 21 : 31)}>{textos[0]}</text>
			{textos[1] && <text fontWeight="bold" fontFamily="Consolas, monospace" fontSize="16" id="svg_3" x={x + 65 - (textos[1].length * 4.5)} y={y + 41}>{textos[1]}</text>}
		</g>
	)
}


const getVarianteFg = (variante) => {
	switch (variante) {
		case 'primary': return '#004085'
		case 'secondary': return '#383d41'
		case 'success': return '#155724'
		case 'danger': return '#721c24'
		case 'warning': return '#856404'
		case 'info': return '#0c5460'
		case 'light': return '#818182'
		case 'dark': return '#1b1e21'
		default: return '#000000'
	}
}


const getVarianteBg = (variante) => {
	switch (variante) {
		case 'primary': return '#cce5ff'
		case 'secondary': return '#e2e3e5'
		case 'success': return '#d4edda'
		case 'danger': return '#f8d7da'
		case 'warning': return '#fff3cd'
		case 'info': return '#d1ecf1'
		case 'light': return '#fefefe'
		case 'dark': return '#fdfdfe'
		default: return '#ffffff'
	}
}

const getVarianteBorder = (variante) => {
	switch (variante) {
		case 'primary': return '#b8daff'
		case 'secondary': return '#d6d8db'
		case 'success': return '#c3e6cb'
		case 'danger': return '#f5c6cb'
		case 'warning': return '#ffeeba'
		case 'info': return '#bee5eb'
		case 'light': return '#fefefe'
		case 'dark': return '#fdfdfe'
		default: return '#000000'
	}
}

export default DiagramaEstadoPedido