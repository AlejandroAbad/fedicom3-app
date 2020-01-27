import React from 'react'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem';

const StatusCode = ({ res }) => {
	let statusCode = res.statusCode
	if (!statusCode) return null

	let bg = 'secondary'
	let text = 'white'

	if (statusCode >= 200 && statusCode < 300){
		bg = 'success'
	} else if (statusCode >= 400 && statusCode < 500) {
		bg = 'warning'
		text = 'black'
	} else if (statusCode >= 500) {
		bg = 'danger'
		text = 'black'
	}

	let statusText = null
	switch (statusCode) {
		case 200: 	statusText = 'OK'; break;
		case 201: statusText = 'Recurso creado'; break;
		case 202: statusText = 'Aceptado'; break;
		case 204: statusText = 'Sin contenido'; break;
		
		case 400: statusText = 'Petición erronea'; break;
		case 401: statusText = 'No autenticado'; break;
		case 403: statusText = 'No autorizado'; break;
		case 404: statusText = 'No encontrado'; break;
		case 405: statusText = 'Método no permitido'; break;
		case 408: statusText = 'Timeout'; break;
		case 409: statusText = 'Conflicto'; break;
		case 410: statusText = 'Gone'; break;
		case 411: statusText = 'Longitud requerida'; break;
		case 412: statusText = 'Fallo precondición'; break;

		case 500: statusText = 'Error del servidor'; break;
		case 501: statusText = 'No implementado'; break;
		case 502: statusText = 'Bad Gateway'; break;
		case 503: statusText = 'Servicio no disponible'; break;
		default: 
			statusText = null
	}

	let className = `rounded px-2 py-1 bg-${bg} text-${text}`

	let valor = (<><span className={className}>{statusCode}</span><code className="ml-2">{statusText}</code></>)

	return (
		<ListGroupItem sm={2} k="Estado" v={valor} />
	)
}

export default StatusCode