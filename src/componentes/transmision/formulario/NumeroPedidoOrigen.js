import React from 'react'
import { Form, Col, Row } from 'react-bootstrap';

const NumeroPedidoOrigen = ({ filtro, register, errors, ...props }) => {

    let referencia = register

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">Número pedido Origen</Form.Label>
            <Col md="8">
                <Form.Control type="text" placeholder="cR.b.numeroPedidoOrigen" size="sm" name="numeroPedidoOrigen" ref={referencia} isInvalid={errors.numeroPedidoOrigen} />
            </Col>
            <Form.Label column className="text-danger px-3 pt-0 mt-0">
                {errors.numeroPedidoOrigen && errors.numeroPedidoOrigen.message}
            </Form.Label >
        </Form.Group>
    )
}

export default NumeroPedidoOrigen