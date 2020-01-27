import React from 'react'
import { Container, Button } from 'react-bootstrap';
import { GoCheck, GoX } from 'react-icons/go';

import Icono from 'componentes/icono/Icono'


const CabeceraFormulario = ({ icono, texto, onAceptar, onCancelar, ...props }) => {
    return (
        <Container fluid className="my-md-3 pt-md-2 pb-3">
            <h3>
                <Icono icono={icono} posicion={[null, 2]} className="mr-2" />{texto}
                <Button variant="success" className="float-right ml-1" size="md" href="#" onClick={onAceptar}>
                    <Icono icono={GoCheck} posicion={[22, 2]} className="mr-md-1" /><span className="d-none d-md-inline-block">Aplicar</span>
                </Button>
                <Button variant="secondary" className="float-right" size="md" href="#" onClick={onCancelar}>
                    <Icono icono={GoX} posicion={[22, 2]} className="mr-md-1" /><span className="d-none d-md-inline-block">Descartar</span>
                </Button>
            </h3>
        </Container>
    )
}


export default CabeceraFormulario