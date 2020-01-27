import React from 'react'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem';

const Url = ({ req }) => {
	let url = req.url
	if (!url) return null

	let valor = <code className="">{url}</code>

	return (
		<ListGroupItem sm={1} k="URL" v={valor} />
	)
}

export default Url