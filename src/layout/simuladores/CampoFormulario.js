import React, { useEffect, useState } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import useStateLocalStorage from 'util/useStateLocalStorage';



export const useCampoFormulario = (nombre, hookFormulario, valorPorDefecto) => {

	const [valor, setValor] = useStateLocalStorage(nombre, hookFormulario.getValues()[nombre] || valorPorDefecto, false );

	useEffect(() => {
		hookFormulario.register({ name: nombre })
	}, [hookFormulario, nombre])

	useEffect(() => {
		hookFormulario.setValue(nombre, valor)
	}, [hookFormulario, nombre, valor])


	return [valor, setValor];

}

export const CampoFormulario = ({ titulo, notas, ...props }) => {
	return (
		<Form.Group as={Row} className="align-items-center">
			<Form.Label column md={4} lg={3}>
				{titulo}
			</Form.Label>
			<Col md={8} lg={9}>
				{props.children}
			</Col>
			{notas &&
				<Form.Label column xs={12} className="text-muted px-3 pt-0 mt-0">
					<small>{notas}</small>
				</Form.Label>}
		</Form.Group>
	)
}
