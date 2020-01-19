import React from 'react'
import { Form } from 'react-bootstrap';

const Crc = ({ reg, valor, errors, ...props }) => {

    let referencia = reg({
        pattern: {
            value: /^[A-F0-9]{8}$/i,
            message: "CRC no válido"
        }
    })

    return (
        <Form.Group>
            <Form.Label>CRC de transmisión</Form.Label>
            <Form.Control type="text" placeholder="crc" size="sm" name="crc" ref={referencia} />
            <Form.Text className="text-danger">
                {errors.crc && errors.crc.message}
            </Form.Text>
        </Form.Group>
    )
}

export default Crc