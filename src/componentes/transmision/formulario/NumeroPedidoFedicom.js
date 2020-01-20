import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';

const NumeroPedidoFedicom = ({ filtro, register, errors, ...props }) => {

    let referencia = register({
        pattern: {
            value: /^[A-F0-9]{24}$/i,
            message: "Número de pedido no válido"
        }
    })

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">Número pedido Fedicom</Form.Label>
            <Col md="8">
                <Form.Control type="text" placeholder="crc" size="sm" name="numeroPedidoFedicom" ref={referencia} isInvalid={errors.numeroPedidoFedicom} />
            </Col>
            <Form.Label column className="text-danger px-3 pt-0 mt-0">
                {errors.numeroPedidoFedicom && errors.numeroPedidoFedicom.message}
            </Form.Label>
        </Form.Group>
    )
}

export default NumeroPedidoFedicom