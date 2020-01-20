import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';

const NumeroPedidoSAP = ({ filtro, register, errors, ...props }) => {

    let referencia = register({
        pattern: {
            value: /^[0-9]{1,12}$/i,
            message: "Número de pedido SAP no válido"
        }
    })

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">Número de pedido SAP</Form.Label>
            <Col md="8">
                <Form.Control type="text" placeholder="numerosPedidoSAP | pedidoAgrupado" size="sm" name="numeroPedidoSAP" ref={referencia} isInvalid={errors.numeroPedidoSAP} />
            </Col>
            <Form.Label column className="text-danger px-3 pt-0 mt-0">
                {errors.numeroPedidoSAP && errors.numeroPedidoSAP.message}
            </Form.Label >
        </Form.Group>
    )
}

export default NumeroPedidoSAP