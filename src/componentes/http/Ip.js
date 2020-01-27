import React from 'react'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem';

const Ip = ({ req }) => {
	let ip = req.ip
	if (!ip) return null

	if (ip.startsWith('::ffff:')) ip = ip.substring(7);
	let valor = <span className="text-monospace">{req.ip}</span>

	return (
		<ListGroupItem sm={1} k="IP" v={valor} />
	)
}

export default Ip