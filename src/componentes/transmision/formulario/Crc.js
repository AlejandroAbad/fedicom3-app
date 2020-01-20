import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';

const Crc = ({ filtro, register, errors, ...props }) => {

    let referencia = register({
        pattern: {
            value: /^[A-F0-9]{8}$/i,
            message: "CRC no válido"
        }
    })

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">CRC de transmisión</Form.Label>
            <Col md="8">
                <Form.Control maxLength={8} type="text" placeholder="sR.b.crc" size="sm" name="crc" ref={referencia} isInvalid={errors.crc} />
            </Col>
            <Form.Label column className="text-danger px-3 pt-0 mt-0">
                {errors.crc && errors.crc.message}
            </Form.Label >
        </Form.Group>
    )
}

export default Crc