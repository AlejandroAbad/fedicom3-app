import K from 'K';
import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import fedicomFetch from 'util/fedicomFetch';



const EstadoBalanceo = ({ jwt }) => {

	const [resultadoBalanceadores, setResultadoBalanceadores] = useState({ cargando: false, datos: null, error: null });

	useEffect( ()=> {
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/balanceadores', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultadoBalanceadores({ datos: response.body, error: null, cargando: false });
					} else {
						setResultadoBalanceadores({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultadoBalanceadores({ datos: null, error, cargando: false });
			})
	}, [jwt, setResultadoBalanceadores])


	return <>
		<h2>EstadoBalanceo</h2>
		<ReactJson src={resultadoBalanceadores} collapsed/>
		
	</>

}

export default EstadoBalanceo;