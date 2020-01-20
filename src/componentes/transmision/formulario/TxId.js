import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';

const TxId = ({ filtro, register, errors, ...props }) => {

    let referencia = register({
        pattern: {
            value: /^[A-F0-9]{24}$/i,
            message: "ID de transmisión no válido"
        }
    })

    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column md="4">ID de transmisión</Form.Label>
            <Col md="8">
                <Form.Control type="text" placeholder="_id" size="sm" name="txid" ref={referencia} isInvalid={errors.txid} />
            </Col>
            <Form.Label column className="text-danger px-3 pt-0 mt-0">
                {errors.txid && errors.txid.message}
            </Form.Label >
        </Form.Group>
    )
}

export default TxId