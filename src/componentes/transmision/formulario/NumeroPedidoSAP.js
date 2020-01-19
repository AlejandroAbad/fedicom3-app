import React from 'react'
import { Form } from 'react-bootstrap';

const NumeroPedidoSAP = ({ reg, valor, errors, ...props }) => {

    let referencia = reg({
        pattern: {
            value: /^[0-9]{1,12}$/i,
            message: "Número de pedido SAP no válido"
        }
    })

    return (
        <Form.Group>
            <Form.Label>Número de pedido SAP</Form.Label>
            <Form.Control type="text" placeholder="numerosPedidoSAP | pedidoAgrupado" size="sm" name="numeroPedidoSAP" ref={referencia} />
            <Form.Text className="text-danger">
                {errors.numeroPedidoSAP && errors.numeroPedidoSAP.message}
            </Form.Text>
        </Form.Group>
    )
}

export default NumeroPedidoSAP