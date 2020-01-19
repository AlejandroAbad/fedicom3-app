import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Dropdown } from 'react-bootstrap';
import ReactJson from 'react-json-view';

import { GoDiff, GoKey } from 'react-icons/go';
import { FiFilter } from 'react-icons/fi'

import Icono from 'componentes/icono/Icono'
import CabeceraFormulario from './CabeceraFormulario'
import BusquedaTransmisionUnica from './BusquedaTransmisionUnica'


const obtenerModoDelFiltro = (f) => {
    if (!f) return 2;

    return (f._id ||
        f.crc ||
        (f.sapResponse && f.sapResponse.body && f.sapResponse.body.crc) ||
        (f.clientRequest && f.clientRequest.body && f.clientRequest.body.codigoCliente && f.clientRequest.body.numeroPedidoOrigen) ||
        (f.numeroPedidoAgrupado)
    ) ? 0 : 1;

}


const MODOS = [
    [GoKey, 'Buscar por campo clave'],
    [GoDiff, 'Utilizar filtros']
]

const SelectorModoBusqueda = ({ modo, cambiarModo, ...props }) => {

    return (
        <Dropdown className="">
            <Dropdown.Toggle variant="outline-primary" className="w-100 text-left mr-auto pr-4">
                <span className="w-100 d-inline-block">
                    <Icono icono={MODOS[modo][0]} posicion={[22,3]} className="mr-1" />{MODOS[modo][1]}
                </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
                {
                    MODOS.map((e, i) => {
                        return (
                            <Dropdown.Item key={i} href="#" onClick={() => cambiarModo(i)}>
                                <Icono icono={e[0]} posicion={[22, 3]} className="mr-1" />{e[1]}
                            </Dropdown.Item>
                        )
                    })
                }
            </Dropdown.Menu>
        </Dropdown>
    )
}


const FormularioFiltros = ({ filtro, onAceptar, onCancelar, ...props }) => {

    const [modo, cambiarModo] = useState(obtenerModoDelFiltro(filtro));
    const { handleSubmit, register, errors } = useForm();

    const descartarCambios = () => {
        if (onCancelar)
            onCancelar()
    }

    const aplicarCambios = (valores) => {
        if (onAceptar) {

        }
        console.log(valores);
    }



    return (<>

        <CabeceraFormulario icono={FiFilter} texto="Filtrar transmisiones" onCancelar={descartarCambios} onAceptar={handleSubmit(aplicarCambios)} />



        <Container fluid className="pt-3">
            <SelectorModoBusqueda modo={modo} cambiarModo={cambiarModo} />

            <Row className="mx-0 px-0 py-4">
                <Col>
                    {modo === 0 && <BusquedaTransmisionUnica register={register} errors={errors} />}
                    {modo === 1 && <BusquedaFiltrada register={register} errors={errors} />}
                </Col>
            </Row>
        </Container>


        <Container fluid className="mt-5">
            <Row>
                <Col>
                    <ReactJson src={filtro} />
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



export default FormularioFiltros