import React from 'react';
import { Badge, Popover, OverlayTrigger } from 'react-bootstrap';

const ESTADOS = {
    '1010': [1010, 'Recepcionada', 'Transmisión recepcionada en el concentrador, pendiente de procesar.', 'secondary'],
    '1020': [1020, 'Esperando incidencias', 'Transmisión enviada a SAP, a la espera de recibir incidencias.', 'secondary'],
    '1030': [1030, 'Incidencias recibidas', 'Transmisión procesada por SAP, pendiente responder al cliente.', 'secondary'],
    '3010': [3010, 'Fallo autenticación', 'La transmisión no se procesa porque falló la autenticación de la misma', 'warning'],
    '3020': [3020, 'Petición incorrecta', 'La transmisión contiene errores, no se puede tramitar', 'danger'],
    '3110': [3110, 'No SAP', 'Transmisión aceptada y procesada en el concentrador, pero no se pudo contactar con SAP', 'danger'],
    '3120': [3120, 'Rechazado por SAP', 'SAP ha rechazado la transmisión y ha devuelto un error de precondición', 'warning'],
    '8010': [8010, 'Incidencias enviadas', 'Transmisión completada y faltas enviadas. A la espera de confirmación final por SAP.', 'success'],
    '8100': [8100, 'Espera agotada', 'SAP tarda demasiado en devolver número de pedido.', 'danger'],
    '9000': [9000, 'Error interno', 'Ocurrió un error al tratar la transmisión y se devolvió un error 500', 'danger'],
    '9001': [9001, 'Sistema SAP invalido', 'Se intentó lanzar la petición contra un sistema SAP no definido', 'danger'],
    '9002': [9002, 'Imposible retransmitir', 'No es posible retransmitir debido al estado de la transmisión original', 'warning'],
    '9003': [9003, 'Retransmision no forzada', 'Solo se puede retransmitir si se fuerza', 'warning'],
    '9004': [9004, 'Pedido inexistente', 'No existe el pedido consultado', 'warning'],
    '9110': [9110, 'Descartada', 'Transmisión descartada por no ser legible', 'default'],
    '9120': [9120, 'Duplicado', 'La transmisión es un duplicado de otra anterior', 'primary'],
    '9130': [9130, 'Confirmacion recuperada', 'La confirmación se ha recuperado y se ha actualizado el pedido que confirma', 'success'],
    '9140': [9140, 'Sin número de pedido', 'El pedido ha entrado en SAP, pero este no ha devuelto un número de pedido', 'danger'],
    '9900': [9900, 'Ok', 'Transmisión procesada con éxito', 'success']
};
const estadoNoConocido = (estado) => [estado, 'Desconocido', 'No se conoce el estado', 'danger'];


const popover = (estado) => {
    let className = 'border border-' + estado[3];
    return (
        <Popover id="popover-basic" className={className}>
            <Popover.Title as="h3" variant={estado[3] }>
                {estado[1]}
                <Badge className="float-right text-monospace" variant="dark">{estado[0]}</Badge>
            </Popover.Title>
            <Popover.Content>
                {estado[2]}
            </Popover.Content>

        </Popover>
    )
}

const EtiquetaEstado = (props) => {

    let estado = ESTADOS[props.estado] || estadoNoConocido(props.estado)

    return (
        <OverlayTrigger trigger="hover" overlay={popover(estado)} placement="bottom">
            <Badge pill size="lg" variant={estado[3]} className="px-2 py-1" style={{'font-variant': 'small-caps'}} >{estado[1]}</Badge>
        </OverlayTrigger>
    );
};

export default EtiquetaEstado