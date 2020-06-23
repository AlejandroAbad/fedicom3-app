import K from 'K';
import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import fedicomFetch from 'util/fedicomFetch';



const EstadoSqlite = ({ jwt }) => {

	const [resultadoSqlite, setResultadoSqlite] = useState({ cargando: false, datos: null, error: null });

	useEffect( ()=> {
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/sqlite/recuento', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultadoSqlite({ datos: response.body, error: null, cargando: false });
					} else {
						setResultadoSqlite({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultadoSqlite({ datos: null, error, cargando: false });
			})
	}, [jwt, setResultadoSqlite])


	return <>
		<h2>EstadoSqlite</h2>
		<ReactJson src={resultadoSqlite} collapsed/>
		
	</>

}

export default EstadoSqlite;