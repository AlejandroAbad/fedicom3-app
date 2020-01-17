import React, {useState} from 'react'
import { Container, Row, Col, Nav, Form, Button } from 'react-bootstrap';
import ReactJson from 'react-json-view';

import { GoDiff, GoCheck, GoX, GoKey } from 'react-icons/go';
import { FiFilter } from 'react-icons/fi'


const obtenerModoDelFiltro = (f) => {
    if (!f) return 2;

    return (f._id || 
        f.crc ||
        (f.sapResponse && f.sapResponse.body && f.sapResponse.body.crc) ||
        (f.clientRequest && f.clientRequest.body && f.clientRequest.body.codigoCliente && f.clientRequest.body.numeroPedidoOrigen) ||
        (f.numeroPedidoAgrupado)
    ) ? 1 : 2;

}

const FormularioFiltros = (props) => {

    console.log('RENDER');
    const { filtros/*, onAceptar*/, onCancelar } = props
    const [modo, setModo] = useState(obtenerModoDelFiltro(filtros));

    const descartarCambios = () => {
        onCancelar()
    }

    const aplicarCambios = () => {
       /* onAceptar({ type: {$in: [10,14]}} ) */
    }

    const cambiarModo = (eventKey, event) => {
        setModo(parseInt(eventKey));
    }



    return (<>
        <Container fluid className="my-3 pt-2">
            <h3>
                <FiFilter className="mr-2" style={{ paddingBottom: '2px' }} />Filtrar trasmisiones

                <Button variant="success" className="float-right ml-1" size="md" href="#" onClick={aplicarCambios}>
                    <GoCheck size={22} className="mr-1" style={{ paddingBottom: '2px' }} />Aplicar
                </Button>
                <Button variant="secondary" className="float-right" size="md" href="#" onClick={descartarCambios}>
                    <GoX size={22} className="mr-1" style={{ paddingBottom: '2px' }} />Descartar
                </Button>
            </h3>
        </Container>

        <Container fluid className="pt-3">
            <Nav justify variant="tabs" defaultActiveKey={modo} onSelect={cambiarModo}>
                <Nav.Item>
                    <Nav.Link eventKey={2}><b><GoDiff size={22} className="mr-1" style={{ paddingBottom: '2px' }} />Buscar con filtros</b></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey={1}><b><GoKey size={22} className="mr-1" style={{ paddingBottom: '2px' }} />Buscar por campo clave</b></Nav.Link>
                </Nav.Item>

            </Nav>
            <Row className="border border-top-0 rounded-bottom mx-0 px-0 py-4">
                <Col>
                    {modo === 1 && <BusquedaTransmisionUnica /> }
                    {modo === 2 && <BusquedaFiltrada />}
                </Col>
            </Row>
        </Container>



        <Container fluid className="mt-5 pt-5">
            <Row className="mt-5 pt-5">
                <Col>
                    <ReactJson src={filtros} />
                </Col>
            </Row>
        </Container>

    </>);
}

const BusquedaFiltrada = () => {
    return (
        <Container fluid>
            <Row>
                <Col lg={12} className="mt-2">
                    <h5 className="text-muted">Opciones de búsqueda</h5><hr />
                </Col>

                <Col lg={6}>
                    <Form.Group>
                        <Form.Label>Tipo de transmisión:</Form.Label>
                        <Form.Control type="text" placeholder="type" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group>
                        <Form.Label>Estado de la transmisión:</Form.Label>
                        <Form.Control type="text" placeholder="status" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group>
                        <Form.Label>Codigo de cliente:</Form.Label>
                        <Form.Control type="text" placeholder="authenticatingUser | client" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={8}>
                    <Form.Group>
                        <Form.Label>Entre fechas:</Form.Label>
                        <Form.Control type="text" placeholder="createdAt" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={3}>
                    <Form.Group>
                        <Form.Label>Almacén:</Form.Label>
                        <Form.Control type="text" placeholder="client*.body.codigoAlmacenServicio" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={3}>
                    <Form.Group>
                        <Form.Label>Tipo pedido:</Form.Label>
                        <Form.Control type="text" placeholder="client*.body.codigoAlmacenServicio" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={3}>
                    <Form.Group>
                        <Form.Label>Número de líneas:</Form.Label>
                        <Form.Row>
                            <Col sm={5} lg={4}>
                                <Form.Control type="text" placeholder="flags.s.lineas $min" size="sm" />
                            </Col>
                            -
                            <Col sm={5} lg={4}>
                                <Form.Control type="text" placeholder="flags.s.lineas $max" size="sm" />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Col>
                <Col lg={3}>
                    <Form.Group>
                        <Form.Label>Dirección IP:</Form.Label>
                        <Form.Control type="text" placeholder="clientRequest.ip" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={12}>
                    <Form.Group>
                        <Form.Label>Flags:</Form.Label>
                        <Form.Control type="text" placeholder="flags.*" size="sm" />
                    </Form.Group>
                </Col>

                <Col lg={12} className="mt-5">
                    <h5 className="text-muted">Opciones avanzadas</h5><hr />
                </Col>

                <Col lg={3}>
                    <Form.Group>
                        <Form.Label>IID Servidor:</Form.Label>
                        <Form.Control type="text" placeholder="iid" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={4}>
                    <Form.Group>
                        <Form.Label>Software de Farmacia:</Form.Label>
                        <Form.Control type="text" placeholder="clientRequest.headers.software-id" size="sm" />
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    )
}

const BusquedaTransmisionUnica = () => {
    return (
        <Container fluid>
            <Row>
                <Col lg={12} className="mt-2">
                    <h5 className="text-muted">Campos clave</h5><hr />
                </Col>
                <Col lg={6}>
                    <Form.Group controlId="bcTxId">
                        <Form.Label>ID de transmisión</Form.Label>
                        <Form.Control type="text" placeholder="_id" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group controlId="bcTxCrc">
                        <Form.Label>CRC de transmisión / Número pedido Fedicom</Form.Label>
                        <Form.Control type="text" placeholder="crc | sapResponse.body.crc" size="sm" />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group>
                        <Form.Label>Número pedido origen</Form.Label>
                        <Form.Row>
                            <Col sm={6} lg={5}>
                                <Form.Control type="text" placeholder="clientRequest.body.codigoCliente" size="sm" />
                            </Col>
                            <Col sm={6} lg={5}>
                                <Form.Control type="text" placeholder="clientRequest.body.numeroPedidoOrigen" size="sm" />
                            </Col>
                        </Form.Row>
                        <Form.Text className="text-muted">
                            Requiere utilizar el mismo código de cliente transmitido.
                                    </Form.Text>
                    </Form.Group>
                </Col>

                <Col lg={6}>
                    <Form.Group controlId="bcTxNumPedSap">
                        <Form.Label>Número de pedido SAP</Form.Label>
                        <Form.Control type="text" placeholder="numeroPedidoAgrupado | numerosPedidoSAP" size="sm" />
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    )
}


export default FormularioFiltros