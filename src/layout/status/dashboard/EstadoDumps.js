import K from 'K';
import React, { useState, useEffect, useContext } from 'react';
import ReactJson from 'react-json-view';
import fedicomFetch from 'util/fedicomFetch';

import { ContextoAplicacion } from 'contexto';

const EstadoDumps = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const [resultadoDumps, setResultadoDumps] = useState({ cargando: false, datos: null, error: null });

	useEffect( ()=> {
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/dumps', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultadoDumps({ datos: response.body, error: null, cargando: false });
					} else {
						setResultadoDumps({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultadoDumps({ datos: null, error, cargando: false });
			})
	}, [jwt, setResultadoDumps])


	return <>
		<h2>EstadoDumps</h2>
		<ReactJson src={resultadoDumps} collapsed/>
		
	</>

}

export default EstadoDumps;