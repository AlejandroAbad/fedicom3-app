import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ReactJson from 'react-json-view';

import { FaSortAmountDown, FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa'
import CabeceraFormulario from './CabeceraFormulario';

const FormularioOrden = (props) => {

    let { orden/*, onAceptar*/, onCancelar } = props


    const descartarCambios = () => {
        onCancelar()
    }

    const aplicarCambios = () => {
        /* onAceptar({ type: {$in: [10,14]}} ) */
    }

    return (<>
        <CabeceraFormulario icono={FaSortAmountDown} texto="Ordenar" onCancelar={descartarCambios} onAceptar={aplicarCambios} />
        

        <Container fluid>
            <Row>
                <Col lg={2} className="mt-2 text-center">
                    <h5 className="text-muted">Orden</h5>
                    <hr />
                </Col>
                <Col lg={6} className="mt-2">
                    <h5 className="text-muted">Campo</h5>
                    <hr />
                </Col>
                <Col lg={4} className="mt-2">
                    <h5 className="text-muted">Sentido</h5>
                    <hr />
                </Col>
            </Row>

            <Row>
                <Col lg={2} className="mt-2 text-center">
                    <Button variant="link" className="py-0 text-reset"><FaChevronDown size={20} /></Button>
                </Col>
                <Col lg={6} className="mt-2">
                    <Form.Group>
                        <Form.Control as="select" size="sm">
                            <option value="createdAt">Fecha de entrada</option>
                            <option value="client">Cliente</option>
                            <option value="IP">Dirección IP</option>
                            <option value="">- Borrar campo -</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col lg={4} className="mt-2">
                    <Form.Group>
                        <Form.Control as="select" size="sm">
                            <option value="-1">Ascendente</option>
                            <option value="1">Descendente</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col lg={2} className="mt-2 text-center">
                    <Button variant="link" className="py-0 text-reset"><FaChevronDown size={20} /></Button>
                    <Button variant="link" className="py-0 text-reset"><FaChevronUp size={20} /></Button>
                </Col>
                <Col lg={6} className="mt-2">
                    <Form.Group>
                        <Form.Control as="select" size="sm">
                            <option value="client">Cliente</option>
                            <option value="IP">Dirección IP</option>
                            <option value="">- Borrar campo -</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col lg={4} className="mt-2">
                    <Form.Group>
                        <Form.Control as="select" size="sm" value="1">
                            <option value="-1">Ascendente</option>
                            <option value="1">Descendente</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col lg={2} className="mt-2 text-center">
                    <Button variant="link" className="py-0 text-reset"><FaChevronUp size={20} /></Button>
                </Col>
                <Col lg={6} className="mt-2">
                    <Form.Group>
                        <Form.Control as="select" size="sm">
                            <option value="IP">Dirección IP</option>
                            <option value="">- Borrar campo -</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col lg={4} className="mt-2">
                    <Form.Group>
                        <Form.Control as="select" size="sm" value="1">
                            <option value="-1">Ascendente</option>
                            <option value="1">Descendente</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col lg={2} className="mt-2 text-center">
                    <Button disabled variant="link" className="py-0"><FaPlus size={20} /></Button>
                </Col>
                <Col lg={6} className="mt-2">
                    <Form.Group>
                        <Form.Control as="select" size="sm">
                            <option value="">- Seleccione campo -</option>
                            <option value="client">Cliente</option>
                            <option value="IP">Dirección IP</option>

                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col lg={4} className="mt-2">
                    <Form.Group>
                        <Form.Control as="select" size="sm" value="">
                            <option value="">- Seleccione sentido -</option>
                            <option value="-1">Ascendente</option>
                            <option value="1">Descendente</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

        </Container>

        <Container fluid className="mt-5 pt-5">
            <Row className="mt-5 pt-5">
                <Col>
                    <ReactJson src={orden} />
                </Col>
            </Row>
        </Container>

    </>);
}

export default FormularioOrden