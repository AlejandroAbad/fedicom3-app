import K from 'K'
import React from 'react'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem';


const getNombreProgramaFarmacia = (idPrograma) => {
	return K.PROGRAMAS_FARMACIA[parseInt(idPrograma)] || { codigo: idPrograma, nombre: 'Desconocido' }
}


const SoftwareId = ({ req }) => {
	let sid = req.headers?.['software-id']

	if (!sid) return null

	let datosPrograma = getNombreProgramaFarmacia(sid)

	let valor = <>
		<span className="text-monospace">{datosPrograma.nombre}</span>
		<small className="text-muted ml-3">{datosPrograma.codigo}</small>
	</>
	


	return (
		<ListGroupItem sm={3} k="Programa" v={valor} />
	)
}

export default SoftwareId