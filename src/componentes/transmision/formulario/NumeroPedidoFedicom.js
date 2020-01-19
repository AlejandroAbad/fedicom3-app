import React from 'react'
import { Form } from 'react-bootstrap';

const NumeroPedidoFedicom = ({ reg, valor, errors, ...props }) => {

    let referencia = reg({
        pattern: {
            value: /^[A-F0-9]{24}$/i,
            message: "Número de pedido no válido"
        }
    })

    return (
        <Form.Group>
            <Form.Label>Número pedido Fedicom</Form.Label>
            <Form.Control type="text" placeholder="sR.b.crc" size="sm" name="numeroPedidoFedicom" ref={referencia} />
            <Form.Text className="text-danger">
                {errors.numeroPedidoFedicom && errors.numeroPedidoFedicom.message}
            </Form.Text>
        </Form.Group>
    )
}

export default NumeroPedidoFedicom