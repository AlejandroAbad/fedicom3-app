import React, { useState, useEffect } from 'react'
import { Row, Col, Form } from 'react-bootstrap'

import LineasDevolucion from './LineasDevolucion'

const DatosDevolucion = (props) => {

	return (
		<Row>
			<Col xs={12}>
				<DatosBasicosDevolucion {...props} />
			</Col>

			<Col xs={12}>
				<LineasDevolucion {...props} />
			</Col>
		</Row>

	)
}

const getNotaCodigoCliente = (dominio) => {
	switch (dominio) {
		case 'FEDICOM': return 'Los programas de farmacia utilizan códigos de cliente cortos (p.e: 117, 4607)'
		case 'PORTAL_HEFAME': return 'El Portal Hefame debe utilizar códigos de cliente cortos (p.e: 117, 4607)'
		default:
			return null;
	}
}

const DatosBasicosDevolucion = ({ watch, setValue, register, /*errors,*/ valorActual }) => {


	let dominio = watch('auth.dominio')


	let codigoClienteInicial = valorActual?.codigoCliente ?? ""
	let observacionesInicial = valorActual?.observaciones ?? ""

	const [codigoCliente, setCodigoCliente] = useState(codigoClienteInicial)
	const [observaciones, setObservaciones] = useState(observacionesInicial)

	let notaCodigoCliente = getNotaCodigoCliente(dominio)


	useEffect(() => {
		register({ name: 'codigoCliente' })
		register({ name: 'observaciones' })
	}, [register])

	useEffect(() => {
		setValue('codigoCliente', codigoCliente)
		setValue('observaciones', observaciones)
	}, [codigoCliente, observaciones, setValue])

	return (<>
		<Form.Group as={Row} className="align-items-center">
			<Form.Label column md={4} lg={3}>
				Código de cliente
			</Form.Label>
			<Col md={4} lg={3}>
				<Form.Control size="sm" type="text" className="text-center" defaultValue={codigoCliente} onBlur={e => setCodigoCliente(e.target.value)} />
			</Col>
			{notaCodigoCliente &&
				<Form.Label column xs={12} className="text-muted px-3 pt-0 mt-0">
					<small>Nota: {notaCodigoCliente}</small>
				</Form.Label>}
		</Form.Group>
		<Form.Group as={Row} className="align-items-center">
			<Form.Label column md={4} lg={3}>
				Observaciones
			</Form.Label>
			<Col md={8} lg={9}>
				<Form.Control size="sm" type="text" defaultValue={observaciones} onBlur={(e) => setObservaciones(e.target.value)} />
			</Col>
			{/*<Form.Label column className="text-danger px-3 pt-0 mt-0">
                
            	</Form.Label>*/}
		</Form.Group>
	</>
	)
}


export default DatosDevolucion