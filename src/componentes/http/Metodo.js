import React from 'react'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem';

const Metodo = ({ req }) => {
	let metodo = req.method
	if (!metodo) return null

	let bg = 'primary'
	let text = 'white'
	switch (metodo.toUpperCase()) {
		case 'GET': 
			bg = 'success' 
			break
		case 'POST':
			bg = 'primary'
			break
		case 'PUT':
			bg = 'warning'
			text = 'black'
			break
		case 'DELETE':
			bg = 'danger'
			break
		default: 
			bg = 'secondary'
	}

	let className = `rounded px-2 py-1 bg-${bg} text-${text}`

	let valor = (<span className={className}>{metodo.toUpperCase()}</span>)

	return (
		<ListGroupItem sm={2} k="Método" v={valor} />
	)
}

export default Metodo