import React from 'react'
import { Container, Button } from 'react-bootstrap';

import { GoCheck, GoX } from 'react-icons/go';

import Icono from 'componentes/icono/Icono'


const CabeceraFormulario = ({ icono, texto, onAceptar, onCancelar, ...props }) => {
    return (
        <Container fluid className="my-3 pt-2">
            <h3>
                <Icono icono={icono} posicion={[null, 2]} className="mr-2" />{texto}
                <Button variant="success" className="float-right ml-1" size="md" href="#" onClick={onAceptar}>
                    <GoCheck size={22} className="mr-1" style={{ paddingBottom: '2px' }} />Aplicar
                </Button>
                <Button variant="secondary" className="float-right" size="md" href="#" onClick={onCancelar}>
                    <GoX size={22} className="mr-1" style={{ paddingBottom: '2px' }} />Descartar
                </Button>
            </h3>
        </Container>
    )
}


export default CabeceraFormulario