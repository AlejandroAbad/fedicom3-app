import React, { useState } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap';
import Controles from 'componentes/transmision/formulario/Controles'

//import Icono from 'componentes/icono/Icono'

const CAMPOS = [
    ['... el CRC de la transmisión', Controles.Crc],
    ['... el ID de transmisión', Controles.TxId],
    ['... el número pedido Fedicom', Controles.NumeroPedidoFedicom],
    ['... el número pedido origen', Controles.NumeroPedidoOrigen],
    ['... el número de pedido SAP', Controles.NumeroPedidoSAP]
]



const BusquedaTransmisionUnica = ({ filtro, register, errors, ...props }) => {

    const [campo, setCampo] = useState(0)

    let campoSeleccionado = CAMPOS[campo]
    let elementoControl = campoSeleccionado[1];
    
    const control = elementoControl({
        reg: register,
        errors: errors
    });

    return (
        <Container fluid>
            <Row>

                <Col sm={12} className="mb-3">
                    <Form.Group>
                        <Form.Label>Buscar según el valor de ...</Form.Label>
                        <Form.Control as="select" className="d-inline-block" size="sm" defaultValue={campo} onChange={(e) => setCampo(e.target.value)}>
                            {
                                CAMPOS.map((e, i) => {
                                    return (
                                        <option key={i} value={i}>{e[0]}</option>
                                    )
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col sm={12}>
                    {control}
                </Col>
            </Row>
        </Container >
    )
}

export default BusquedaTransmisionUnica