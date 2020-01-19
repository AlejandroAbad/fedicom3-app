import React from 'react'
import { Form, Col, Row } from 'react-bootstrap';

const NumeroPedidoOrigen = ({ reg, valor, errors, ...props }) => {

    let referenciaCliente = reg({
        pattern: {
            value: /^[0-9]{1,10}$/i,
            message: "Código de cliente no válido"
        }
    })

    let referenciaCodigo = reg({
        pattern: {
            require: "Campo obligatorio"
        }
    })

    return (
        <Row>
            <Col md={4}>
                <Form.Group>
                    <Form.Label>Código del cliente</Form.Label>
                    <Form.Control type="text" placeholder="cR.b.codigoCliente" size="sm" ref={referenciaCliente} name="codigoCliente" />
                    <Form.Text className="text-muted">
                        Requiere utilizar el mismo código de cliente transmitido.
                    </Form.Text>
                    <Form.Text className="text-danger">
                        {errors.codigoCliente && errors.codigoCliente.message}
                    </Form.Text>
                </Form.Group>
            </Col>
            <Col md={8}>
                <Form.Group>
                    <Form.Label>Número pedido origen</Form.Label>
                    <Form.Control type="text" placeholder="cR.b.numeroPedidoOrigen" size="sm" ref={referenciaCodigo} name="numeroPedidoOrigen" />
                    <Form.Text className="text-danger">
                        {errors.numeroPedidoOrigen && errors.numeroPedidoOrigen.message}
                    </Form.Text>
                </Form.Group>
            </Col>
        </Row>
    )
}

export default NumeroPedidoOrigen