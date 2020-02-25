import React from 'react'
import { Alert } from 'react-bootstrap'


const ConsultaVacia = ({ titulo, texto }) => {

	titulo = titulo ?? 'Sin resultados'
	texto = texto ?? ''
	return (

		<Alert variant='warning' className="mt-3">
			<Alert.Heading className="mt-1">{titulo}</Alert.Heading>
			{texto}
		</Alert>
	)
}

export default ConsultaVacia