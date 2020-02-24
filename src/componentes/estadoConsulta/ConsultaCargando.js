import React from 'react'
import { Alert, Spinner } from 'react-bootstrap'


const ConsultaCargando = ({texto}) => {

	texto = texto ?? 'Cargando datos ...'
	return (
		<Alert variant='primary' className="text-center mt-3">
			<Spinner animation="border" variant="primary" className="mt-2" />
			<h5 className="pt-2">{texto}</h5>
		</Alert>
	)
}

export default ConsultaCargando