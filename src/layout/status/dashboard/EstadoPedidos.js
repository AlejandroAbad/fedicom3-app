import K from 'K';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import ReactJson from 'react-json-view';
import fedicomFetch from 'util/fedicomFetch';

import { ContextoAplicacion } from 'contexto';
import { EJSON } from 'bson';
import moment from 'moment';
import DiagramaEstadoPedidos from 'componentes/diagramas/DiagramaEstadoGeneral';
import useInterval from 'util/useInterval';

const EstadoPedidos = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const [resultadoPedidos, setResultadoPedidos] = useState({ cargando: false, datos: null, error: null });

	const ejecutarConsulta = useCallback(() => {
		const pipeline = EJSON.serialize([
			{
				$match: {
					type: 10,
					createdAt: { $gte: moment().startOf('day').toDate()}
				}
			},
			{
				$group: {
					_id: "$status",
					transmisiones: {
						$sum: 1
					}
				}
			}
		]);

		fedicomFetch(K.DESTINOS.MONITOR + '/v1/agregacion', { method: 'PUT' }, jwt, pipeline)
			.then(response => {
				console.log(response)
				if (response) {
					if (response.ok) {
						setResultadoPedidos({ datos: response.body, error: null, cargando: false });
					} else {
						setResultadoPedidos({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultadoPedidos({ datos: null, error, cargando: false });
			})
	}, [jwt, setResultadoPedidos])

	useEffect(() => {
		ejecutarConsulta()
	}, [ejecutarConsulta]);

	useInterval(ejecutarConsulta, 5000);


	return <>
		<DiagramaEstadoPedidos estado={resultadoPedidos} />

		<h2>EstadoPedidos</h2>
		<ReactJson src={resultadoPedidos} collapsed />

	</>

}

export default EstadoPedidos;