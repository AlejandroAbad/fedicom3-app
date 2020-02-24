import React from 'react';




const sOk = (estado) => {
	switch (estado) {
		case 9900:
			return { variante: 'success', activo: true, resaltar: true }
		default:
			return { variante: 'dark', activo: false, resaltar: false }
	}
}

const sEnviadas = (estado) => {
	switch (estado) {
		case 8010:
			return { variante: 'success', activo: true, resaltar: true }
		case 9900:
		case 8100:
		case 9140:
			return { variante: 'success', activo: true, resaltar: false }
		default:
			return { variante: 'dark', activo: false, resaltar: false }
	}
}

const sRecibidas = (estado) => {
	switch (estado) {
		case 1030:
			return { variante: 'success', activo: true, resaltar: true }
		case 9900:
		case 8100:
		case 9140:
		case 8010:
			return { variante: 'success', activo: true, resaltar: false }
		default:
			return { variante: 'dark', activo: false, resaltar: false }
	}
}

const sEsperando = (estado) => {
	switch (estado) {
		case 1020:
			return { variante: 'success', activo: true, resaltar: true }
		case 1030:
		case 9900:
		case 8100:
		case 9140:
		case 8010:
		case 3110:
		case 3120:
		case 9001:
			return { variante: 'success', activo: true, resaltar: false }
		default:
			return { variante: 'dark', activo: false, resaltar: false }
	}
}

const sRecepcionada = (estado) => {
	switch (estado) {
		case 1010:
			return { variante: 'success', activo: true, resaltar: true }
		case 1020:
		case 1030:
		case 9900:
		case 8100:
		case 9140:
		case 8010:
		case 3110:
		case 3120:
		case 9001:
			return { variante: 'success', activo: true, resaltar: false }
		default:
			return { variante: 'dark', activo: false, resaltar: false }
	}
}


const sE1 = (estado) => {
	switch (estado) {
		case 3010:
			return { variante: 'warning', activo: true, resaltar: true, texto: 'FALLO|AUTENTICACION' }
		case 3011:
			return { variante: 'warning', activo: true, resaltar: true, texto: 'NO|AUTORIZADO' }
		case 3020:
			return { variante: 'warning', activo: true, resaltar: true, texto: 'PETICIÓN|INCORRECTA' }
		case 9000:
			return { variante: 'danger', activo: true, resaltar: true, texto: 'ERROR|INTERNO' }
		default:
			return { activo: false }
	}
}

const sE2 = (estado) => {
	switch (estado) {
		case 3110:
			return { variante: 'danger', activo: true, resaltar: true, texto: 'NO SAP' }
		case 3120:
			return { variante: 'warning', activo: true, resaltar: true, texto: 'RECHAZADO|POR SAP' }
		case 9001:
			return { variante: 'warning', activo: true, resaltar: true, texto: 'SISTEMA SAP|INVÁLIDO' }
		default:
			return { activo: false }
	}
}

const sE3 = (estado) => {
	switch (estado) {
		case 9140:
			return { variante: 'danger', activo: true, resaltar: true, texto: 'SIN NÚMERO|DE PEDIDO' }
		case 8100:
			return { variante: 'danger', activo: true, resaltar: true, texto: 'ESPERA|AGOTADA' }
		default:
			return { activo: false }
	}
}


const DiagramaEstadoPedido = ({ estado }) => {

	let xOffset = 80
	let xOffsetFila2 = [80, 80 + 460, 80 + 460 + 460]

	let estados = {
		recepcionada: sRecepcionada(estado),
		esperando: sEsperando(estado),
		recibidas: sRecibidas(estado),
		enviadas: sEnviadas(estado),
		ok: sOk(estado),
		e1: sE1(estado),
		e2: sE2(estado),
		e3: sE3(estado)
	}

	let noOk = estados.e1.activo || estados.e2.activo || estados.e3.activo


	return (
		<svg viewBox={`0 0 1140 ${noOk ? '155' : '100'}`} preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">



			<Linea x={-20} y={65} variante={estados.recepcionada.activo ? estados.recepcionada.variante : 'ligth'} resaltar={estados.enviadas.resaltar} />
			<Caja texto="RECEPCIONADO" x={xOffset} y={40} variante={estados.recepcionada.variante} resaltar={estados.recepcionada.resaltar} />


			<Linea x={xOffset + 130} y={65} variante={estados.esperando.activo ? estados.esperando.variante : 'ligth'} resaltar={estados.enviadas.resaltar} />
			{xOffset += 230}
			<Caja texto="ESPERANDO|A SAP" x={xOffset} y={40} variante={estados.esperando.variante} resaltar={estados.esperando.resaltar} />


			<Linea x={xOffset + 130} y={65} variante={estados.recibidas.activo ? estados.recibidas.variante : 'ligth'} resaltar={estados.enviadas.resaltar} />
			{xOffset += 230}
			<Caja texto="ENTREGADO|A SAP" x={xOffset} y={40} variante={estados.recibidas.variante} resaltar={estados.recibidas.resaltar} />


			<Linea x={xOffset + 130} y={65} variante={estados.enviadas.activo ? estados.enviadas.variante : 'ligth'} resaltar={estados.enviadas.resaltar} />
			{xOffset += 230}
			<Caja texto="FALTAS|ENVIADAS" x={xOffset} y={40} variante={estados.enviadas.variante} resaltar={estados.enviadas.resaltar} />



			<Linea x={xOffset + 130} y={65} variante={estados.ok.activo ? estados.ok.variante : 'ligth'} />
			{xOffset += 230}
			<Caja texto="OK" x={xOffset} y={40} variante={estados.ok.variante} resaltar={estados.ok.resaltar} />



			{estados.e1.activo && <>
				<LineaError x={xOffsetFila2[0] - 100} y={65} variante={estados.e1.variante} />
				<Caja texto={estados.e1.texto} x={xOffsetFila2[0]} y={100} variante={estados.e1.variante} resaltar />
			</>}
			{estados.e2.activo && <>
				<LineaError x={xOffsetFila2[1] - 100} y={65} variante={estados.e2.variante} />
				<Caja texto={estados.e2.texto} x={xOffsetFila2[1]} y={100} variante={estados.e2.variante} resaltar />
			</>}
			{estados.e3.activo && <>
				<LineaError x={xOffsetFila2[2] - 100} y={65} variante={estados.e3.variante} />
				<Caja texto={estados.e3.texto} x={xOffsetFila2[2]} y={100} variante={estados.e3.variante} resaltar />
			</>}

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
/*
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
*/

export default DiagramaEstadoPedido