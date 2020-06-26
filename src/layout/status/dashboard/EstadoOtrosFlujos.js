import React, { useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { EJSON } from 'bson';
import moment from 'moment';
import useInterval from 'hooks/useInterval';
import { useApiMonitor } from 'hooks/useApiMonitor';
import DiagramaFlujoDevoluciones from 'componentes/diagramas/DiagramaFlujoDevoluciones';
import { Row, Col, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';





const EstadoOtrosFlujos = () => {

	const { jwt } = useContext(ContextoAplicacion);

	const PIPELINE = EJSON.serialize([
		{
			$match: {
				type: { $nin: [10, 13, 50] },
				createdAt: { $gte: moment().startOf('day').toDate() }
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

		resultado.datos.forEach((resultado) => {
			let { tipo, estado } = resultado._id;
			let cantidad = resultado.transmisiones;

			let grupo = _agrupar(tipo, estado);

			if (!estadoTransmisiones[grupo[0]]) estadoTransmisiones[grupo[0]] = {}
			if (!estadoTransmisiones[grupo[0]][grupo[1]]) estadoTransmisiones[grupo[0]][grupo[1]] = 0;
			estadoTransmisiones[grupo[0]][grupo[1]] += cantidad;

		})

	}

	return <>
		<Row>
			<Col xl={12} className="mt-4 mt-xl-0" >
				<h4>Flujo devoluciones</h4>
				<DiagramaFlujoDevoluciones estado={estadoTransmisiones} />
			</Col>
		</Row>
		<Row>
			<Col xl={12} className="mt-4">
				<Col xs={12}>
					<h4>Otras transmisiones</h4>
				</Col>
				<Col xs={12}>
					<ListGroup className='list-group-flush text-left'>
						<FilaTablaConsultas titulo="Consulta Pedidos" valores={estadoTransmisiones.cPedido} />
						<FilaTablaConsultas titulo="Consulta Devoluciones" valores={estadoTransmisiones.cDevolucion} />
						<FilaTablaConsultas titulo="Consulta Logística" valores={estadoTransmisiones.cLogistica} />
						<FilaTablaConsultas titulo="Consulta Albaranes" valores={estadoTransmisiones.cAlbaran} />
						<FilaTablaConsultas titulo="Consulta Facturas" valores={estadoTransmisiones.cFactura} />
						<FilaTablaConsultas titulo="Autenticaciones" valores={estadoTransmisiones.autenticacion} />
						<FilaTablaConsultas titulo="Pedidos duplicados" valores={estadoTransmisiones.dPedido} />
						<FilaTablaConsultas titulo="Devoluciones duplicadas" valores={estadoTransmisiones.dDevolucion} />
						<FilaTablaConsultas titulo="Logistica duplicada" valores={estadoTransmisiones.dLogistica} />
					</ListGroup>
				</Col>
			</Col>

		</Row>
	</>
}


const FilaTablaConsultas = ({ titulo, valores, className, ...props }) => {

	if (isNaN(valores?.ok ?? 0 + valores?.rechazo ?? 0 + valores?.error ?? 0)) return null;
	if (className) className += ' d-flex justify-content-between align-items-center';
	else className = 'd-flex justify-content-between align-items-center';
	return (
		<ListGroupItem className={className} {...props}>
			<h5>{titulo}</h5>
			<h5>
				{(valores?.error > 0) && <Badge variant='danger' pill>{valores.error}</Badge>}
				{(valores?.rechazo > 0) && <Badge variant='info' pill>{valores.rechazo}</Badge>}
				<Badge variant={valores?.ok ? 'success' : 'light'} pill>{valores?.ok || '-'}</Badge>
				{(valores?.pendiente > 0) && <Badge variant='info' pill>{valores.pendiente}</Badge>}
			</h5>
		</ListGroupItem>
	)
}


const _agrupar = (tipo, estado) => {
	switch (tipo) {
		case 0: return _agruparAutenticacion(tipo, estado);
		case 20: return _agruparDevolucion(tipo, estado);
		case 11:
		case 21:
		case 30:
		case 31:
		case 40:
		case 41:
		case 51: return _agruparConsulta(tipo, estado);
		case 12:
		case 22:
		case 52: return _agruparDuplicado(tipo, estado);

		default: return ['desconocido ' + tipo, estado];
	}
}

/** TIPO 0 */
const _agruparAutenticacion = (tipo, estado) => {
	switch (estado) {
		case 3010:
		case 3020: return ['autenticacion', 'rechazo'];
		default: return ['autenticacion', 'ok'];
	}
}

/** TIPO 20 */
const _agruparDevolucion = (tipo, estado) => {

	switch (estado) {
		case 1010:
		case 1020:
		case 1030: return ['devolucion', 'pendiente'];

		case 3110: return ['devolucion', 'error'];

		case 9900:
		case 29000: return ['devolucion', 'ok'];

		default: return ['devolucion', 'rechazo'];
	}
}

const _agruparConsulta = (tipo, estado) => {
	let grupoPrincipal = 'desconocido';
	switch (tipo) {
		case 11: grupoPrincipal = 'cPedido'; break;
		case 21: grupoPrincipal = 'cDevolucion'; break;
		case 30: grupoPrincipal = 'cAlbaran'; break;
		case 31: grupoPrincipal = 'cAlbaran'; break;
		case 40: grupoPrincipal = 'cFactura'; break;
		case 41: grupoPrincipal = 'cFactura'; break;
		case 51: grupoPrincipal = 'cLogistica'; break;
		default: break;
	}


	switch (estado) {
		case 1010:
		case 1020:
		case 1030: return [grupoPrincipal, 'pendiente'];
		case 9005:
		case 9900: return [grupoPrincipal, 'ok'];
		case 3110:
		case 9000: return [grupoPrincipal, 'error'];
		default: return [grupoPrincipal, 'rechazo'];
	}

}

const _agruparDuplicado = (tipo, estado) => {
	switch (tipo) {
		case 12: return ['dPedido', 'ok'];
		case 22: return ['dDevolucion', 'ok'];
		case 52: return ['dLogistica', 'ok'];
		default: return ['?', '?'];
	}
}

export default EstadoOtrosFlujos;