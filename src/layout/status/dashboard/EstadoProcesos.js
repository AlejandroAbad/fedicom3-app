import K from 'K';
import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import fedicomFetch from 'util/fedicomFetch';



const EstadoProcesos = ({ jwt }) => {

	const [resultadoProcesos, setResultadoProcesos] = useState({ cargando: false, datos: null, error: null });

	useEffect( ()=> {
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/procesos', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultadoProcesos({ datos: response.body, error: null, cargando: false });
					} else {
						setResultadoProcesos({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultadoProcesos({ datos: null, error, cargando: false });
			})
	}, [jwt, setResultadoProcesos])


	return <>
		<h2>EstadoProcesos</h2>
		<ReactJson src={resultadoProcesos} collapsed/>
		
	</>

}

export default EstadoProcesos;