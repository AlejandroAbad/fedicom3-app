import K from 'K';
import React, { useState, useEffect, useContext } from 'react';
import ReactJson from 'react-json-view';
import fedicomFetch from 'util/fedicomFetch';

import { ContextoAplicacion } from 'contexto';

const EstadoSap = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const [resultadoSap, setResultadoSap] = useState({ cargando: false, datos: null, error: null });

	useEffect( ()=> {
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/sap/conexion', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultadoSap({ datos: response.body, error: null, cargando: false });
					} else {
						setResultadoSap({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultadoSap({ datos: null, error, cargando: false });
			})
	}, [jwt, setResultadoSap])


	return <>
		<h2>EstadoSap</h2>
		<ReactJson src={resultadoSap} collapsed/>
		
	</>

}

export default EstadoSap;