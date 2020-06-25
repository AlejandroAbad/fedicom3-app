import React, { useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { EJSON } from 'bson';
import moment from 'moment';
import DiagramaFlujoPedidos from 'componentes/diagramas/DiagramaFlujoPedidos';
import useInterval from 'hooks/useInterval';
import { useApiMonitor } from 'hooks/useApiMonitor';





const EstadoPedidos = () => {

	const { jwt } = useContext(ContextoAplicacion);

	const PIPELINE = EJSON.serialize([
		{
			$match: {
				type: 10,
				createdAt: { $gte: moment().startOf('day').toDate() }
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

	const { ejecutarConsulta: ejecutarConsultaPedidos, resultado: resultadoPedidos } = useApiMonitor('/v1/agregacion', jwt, { method: 'PUT', body: PIPELINE });

	useInterval(ejecutarConsultaPedidos, 1000);


	return <>
		<h3>Flujo de pedidos</h3>
		<DiagramaFlujoPedidos estado={resultadoPedidos} />
	</>

}

export default EstadoPedidos;