import React from 'react'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem';

const InstanceId = ({ iid }) => {
	if (!iid) return null

	
	let valor = <span className="text-monospace">{iid}</span>

	return (
		<ListGroupItem sm={2} k="Instancia" v={valor} />
	)
}

export default InstanceId