import K from 'K';
import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import fedicomFetch from 'util/fedicomFetch';



const EstadoBaseDatos = ({ jwt }) => {

	const [resultadoReplicaSet, setResultadoReplicaSet] = useState({ cargando: false, datos: null, error: null });
	const [resultadoBaseDatos, setResultadoBaseDatos] = useState({ cargando: false, datos: null, error: null });

	useEffect( ()=> {
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/mongodb/replicaSet', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultadoReplicaSet({ datos: response.body, error: null, cargando: false });
					} else {
						setResultadoReplicaSet({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultadoReplicaSet({ datos: null, error, cargando: false });
			})
	}, [jwt, setResultadoReplicaSet])


	useEffect(() => {
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/mongodb/database', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultadoBaseDatos({ datos: response.body, error: null, cargando: false });
					} else {
						setResultadoBaseDatos({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultadoBaseDatos({ datos: null, error, cargando: false });
			})
	}, [jwt, setResultadoBaseDatos])

	return <>
		<h2>Estado BaseDatos</h2>
		<ReactJson src={resultadoReplicaSet} collapsed/>
		<ReactJson src={resultadoBaseDatos} collapsed />
	</>

}

export default EstadoBaseDatos;