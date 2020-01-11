import React from 'react';
import { Badge, Popover, OverlayTrigger } from 'react-bootstrap';

const TIPOS = {
    999: [999, 'Inválido', 'Transmisión de tipo desconocido', 'danger'],
    0: [0, 'Autenticación', 'Solicitud de autenticación de usuario', 'success'],
    10: [10, 'Crear pedido', 'Creación de un nuevo pedido', 'primary'],
    11: [11, 'Consulta pedido', 'Consulta de un pedido', 'info'],
    12: [12, 'Pedido duplicado', 'Pedido duplicado', 'info'],
    13: [13, 'Confirmación Pedido', 'SAP confirma la creación del pedido', 'info'],
    14: [14, 'Retransmitir Pedido', 'Reenvío a SAP de un pedido', 'info'],
    20: [20, 'Crear devolucion', 'Creación de una devolución', 'secondary'],
    21: [21, 'Consulta devolucion', 'Consulta de una devolución', 'info'],
    22: [22, 'Devolución duplicada', 'Devolución duplicada', 'info'],
    30: [30, 'Búsqueda de albaranes', 'Búsqueda de albaranes', 'info'],
    31: [31, 'Consulta albarán', 'Transmisión de tipo desconocido', 'info'],
    40: [40, 'Búsqueda de facturas', 'Búsqueda de facturas', 'info'],
    41: [41, 'Consulta factura', 'Transmisión de tipo desconocido', 'info']
};
const tipoNoConocido = (tipo) => [tipo, 'Desconocido', 'No se conoce el tipo', 'danger'];


const popover = (tipo) => {
    let className = 'border border-' + tipo[3];
    return (
        <Popover id="popover-basic" className={className}>
            <Popover.Title as="h3" variant={tipo[3]}>
                {tipo[1]}
                <Badge className="ml-3 float-right text-monospace" variant="dark">{tipo[0]}</Badge>
            </Popover.Title>
            <Popover.Content>
                {tipo[2]}
            </Popover.Content>

        </Popover>
    )
}

const EtiquetaTipo = (props) => {

    let tipo = TIPOS[props.tipo] || tipoNoConocido(props.tipo)

    return (
        <OverlayTrigger trigger="hover" overlay={popover(tipo)} placement="bottom">
            <Badge variant={tipo[3]} className="px-2 py-1" >{tipo[1]}</Badge>
        </OverlayTrigger>
    );
};

export default EtiquetaTipo