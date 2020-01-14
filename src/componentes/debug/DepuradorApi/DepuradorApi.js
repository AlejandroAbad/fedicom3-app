import React, { useRef } from 'react';
import { ProgressBar, Container, Row, Col, Button, Collapse } from 'react-bootstrap';
import ReactJson from 'react-json-view';

import useStateLocalStorage from 'util/useStateLocalStorage';

const DepuradorAPI = (props) => {

    let nombreDepurador = useRef(props.id);
    const [openDebug, setOpenDebug] = useStateLocalStorage('depuradorAPI.' + nombreDepurador.current, false, false);

    var callbackBinds = {};
    if (props.onQueryChanged) {
        callbackBinds = {
            onEdit: (e) => props.onQueryChanged(e.updated_src),
            onAdd: (e) => props.onQueryChanged(e.updated_src),
            onDelete: (e) => props.onQueryChanged(e.updated_src),
            shouldCollapse: (key) => { return ['filter', 'projection', 'sort'].includes(key.name) }
        }
    }

    let estado = null;
    if (props.cargando)
        estado = <ProgressBar animated now={100} label={`Cargando ...`} className="my-3" />;
    else
        if (props.error) estado = <ProgressBar now={100} variant="danger" label={`ERROR`} className="my-3" />;
        else estado = <ProgressBar now={100} variant="success" label={`OK`} className="my-3" />;


    return (
        <Container fluid className="border border-info rounded pb-0 mb-3 mt-5">
            <Col className="text-right my-4">
                <Button size="sm" onClick={() => setOpenDebug(!openDebug)} aria-controls="collapse-depurador-api" aria-expanded={openDebug}>
                    {openDebug ? 'Ocultar debug' : 'Mostrar debug'}
                </Button>
            </Col>

            <Collapse in={openDebug}>
                <Container fluid id="example-collapse-text" className="mt-4 mb-5">
                    <Row>
                        <Col lg={4}>
                            <h3>Consulta</h3>
                            <ReactJson src={props.query || {}} {...callbackBinds} />
                        </Col>
                        <Col lg={8}>
                            <h3>Respuesta</h3>
                            {estado}
                            {!props.cargando && <ReactJson src={props.resultado || props.error || {}} shouldCollapse={(key) => { return key.name === 'data' }} />}
                        </Col>
                    </Row>
                </Container>
            </Collapse>
        </Container>

    )
}

export default DepuradorAPI;