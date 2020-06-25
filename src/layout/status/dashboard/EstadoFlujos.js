import K from 'K';
import React, { useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { EJSON } from 'bson';
import moment from 'moment';
import DiagramaFlujoPedidos from 'componentes/diagramas/DiagramaFlujoPedidos';
import useInterval from 'hooks/useInterval';
import { useApiMonitor } from 'hooks/useApiMonitor';
import ReactJson from 'react-json-view';





const EstadoFlujos = () => {

	const { jwt } = useContext(ContextoAplicacion);

	const PIPELINE = EJSON.serialize([
		{
			$match: {
				type: { $nin: [10, 13] }/*,
				createdAt: { $gte: moment().startOf('day').toDate() }*/
			}
		},
		{
			$group: {
				_id: {
					tipo: "$type",
					estado: "$status"
				},
				transmisiones: {
					$sum: 1
				}
			}
		}
	]);


	const { ejecutarConsulta, resultado } = useApiMonitor('/v1/agregacion', jwt, { method: 'PUT', body: PIPELINE });

	useInterval(ejecutarConsulta, 5000);

	let estadoTransmisiones = {

	}

	if (resultado.datos && resultado.datos.length) {

		resultado.datos.forEach( (resultado) => {
			let {tipo, estado} = resultado._id;
			let cantidad = resultado.transmisiones;

			let nombreTipo = K.TIPOS_TRANSMISION[tipo].titulo;
			let nombreEstado = K.ESTADOS_TRANSMISION[estado].titulo;

			if (!estadoTransmisiones[nombreTipo]) estadoTransmisiones[nombreTipo] = {}
			estadoTransmisiones[nombreTipo][nombreEstado] = cantidad;

		})

	}


	return <>
		<h3>Otras transmisiones</h3>
		<ReactJson src={estadoTransmisiones} />
	</>

}

export default EstadoFlujos;