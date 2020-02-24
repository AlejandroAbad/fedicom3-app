import React from 'react'
import { Alert } from 'react-bootstrap'


const ConsultaCargando = ({ texto, errores, titulo, errorGenerico }) => {

	errorGenerico = errorGenerico ?? 'No se pudo alcanzar el servidor'
	titulo = titulo ?? 'Error al obtener datos'

	let alertas = [];
	if (errores.forEach) {
		errores.forEach((err, index) => {
			if (err.codigo && err.descripcion) {
				alertas.push(<li key={index}>{err.descripcion} <small className="text-muted">{err.codigo}</small></li>);
			} else {
				alertas.push(<li key={index}>No se pudo alcanzar el servidor</li>);
			}
		})
	} else {
		alertas.push(<li key={0}>{errorGenerico}</li>);
	}

	return (
		<Alert variant='danger'>
			<Alert.Heading>{titulo}</Alert.Heading>
			<ul>
				{alertas}
			</ul>
		</Alert>
	)
}

export default ConsultaCargando