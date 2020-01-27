import React from 'react'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem';

const Ruta = ({ req }) => {
	let route = req.route
	if (!route) return null

	let valor = (<span className="m-0 py-1 px-2s rounded text-monospace">{route}</span>)

	return (
		<ListGroupItem sm={2} k="Ruta" v={valor} />
	)
}

export default Ruta