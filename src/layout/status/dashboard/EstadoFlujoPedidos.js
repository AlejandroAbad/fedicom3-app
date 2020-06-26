import React, { useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { EJSON } from 'bson';
import moment from 'moment';
import DiagramaFlujoPedidos from 'componentes/diagramas/DiagramaFlujoPedidos';
import useInterval from 'hooks/useInterval';
import { useApiMonitor } from 'hooks/useApiMonitor';





const EstadoFlujoPedidos = () => {

	const { jwt } = useContext(ContextoAplicacion);

	const PIPELINE = EJSON.serialize([
		{
			$match: {
				type: {$in: [10, 50]},
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

	const { ejecutarConsulta, resultado } = useApiMonitor('/v1/agregacion', jwt, { method: 'PUT', body: PIPELINE });

	useInterval(ejecutarConsulta, 1000);


	return <>
		<h4>Flujo de pedidos</h4>
		<DiagramaFlujoPedidos estado={resultado} />
	</>

}

export default EstadoFlujoPedidos;