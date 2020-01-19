import React from 'react'
import { Form } from 'react-bootstrap';

const TxId = ({ reg, valor, errors, ...props }) => {

    let referencia = reg({
        pattern: {
            value: /^[A-F0-9]{24}$/i,
            message: "ID de transmisión no válido"
        }
    })

    return (
        <Form.Group>
            <Form.Label>ID de transmisión</Form.Label>
            <Form.Control type="text" placeholder="_id" size="sm" name="txid" ref={referencia} />
            <Form.Text className="text-danger">
                {errors.txid && errors.txid.message}
            </Form.Text>
        </Form.Group>
    )
}

export default TxId