import K from 'K'
import React, { useState, useCallback, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'


import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi'
import fedicomFetch from 'util/fedicomFetch'

import EtiquetaTipo from 'componentes/transmision/EtiquetaTipo'
import EtiquetaEstado from 'componentes/transmision/EtiquetaEstado'
import Fecha from 'componentes/transmision/Fecha'

import DetallesPedido from './detallesPedido/DetallesPedido'
import DetallesHttp from './DetallesHttp'
import DetallesSap from './DetallesSap'
import DetallesDuplicado from './detallesDuplicado/DetallesDuplicado'
import DetallesConfirmacion from './detallesConfirmacion/DetallesConfirmacion'
import BotonRetransmitir from './detallesPedido/RetransmitirPedido'
import SistemaSAP from 'componentes/transmision/SistemaSAP'

const VisorTransmision = ({ jwt, txId, deshabilitarRetransmision, ...props }) => {

    const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false });
    if (props?.match?.params?.txId) txId = props.match.params.txId;

    const ejecutarConsulta = useCallback(() => {
        setResultado({ datos: null, error: null, cargando: false })
        fedicomFetch(K.DESTINOS.MONITOR + '/query', { method: 'PUT' }, jwt, { filter: { _id: txId } })
            .then(response => {
                if (response) {
                    if (response.ok) {
                        setResultado({ datos: response.body, error: null, cargando: false });
                    } else {
                        setResultado({ datos: null, error: response.body, cargando: false });
                    }
                }
            })
            .catch(err => {
                setResultado({ datos: null, error: err, cargando: false });
            })
    }, [setResultado, jwt, txId])

    useEffect(() => {
        ejecutarConsulta()
    }, [ejecutarConsulta, jwt, txId])



    if (resultado?.datos?.data?.length > 0) {

        let tx = resultado.datos.data[0]

        let mostarBotonRetransmision = (!deshabilitarRetransmision && jwt?.data?.perms?.includes("FED3_RETRANSMISION") && tx.type === 10)

        return (
            <>

                <div className="container-xl">

                    <Row className="mt-1">
                        <Col lg={4} sm={7}>
                            <Row >
                                <Col xs={12} className="text-monospace"><strong>Entrada:</strong> <Fecha fecha={tx.createdAt} formato='largo' /></Col>
                                <Col xs={12} className="text-monospace"><small><strong>Modificado:</strong> <Fecha fecha={tx.modifiedAt} formato='largo' /></small></Col>
                            </Row>
                        </Col>
                        <Col lg={4} sm={5}>
                            <Row className="text-sm-right text-lg-center py-1 py-sm-0">
                                <Col xs="auto" sm={12}><EtiquetaTipo tipo={tx.type} /></Col>
                                <Col xs="auto" sm={12}><EtiquetaEstado estado={tx.status} /></Col>
                                {SistemaSAP.modificado(tx) && <Col xs={12} sm={12}><small className="text-monospace"><strong>Sistema SAP modificado:</strong> </small><SistemaSAP transmision={tx} className="pb-1" /></Col>}
                            </Row>
                        </Col>
                        <Col lg={4}>
                            <Row className="text-monospace text-lg-right">
                                <Col xs={12}><strong>TxID: </strong>{tx._id}</Col>
                                <Col xs={12}><small><strong>Instancia: </strong>{tx.iid || <span className="text-danger">N/A</span>}</small> <small><strong>DbVers: </strong>{tx.flags?.v ?? <span className="text-muted">n/a</span>}</small></Col>
                            </Row>
                        </Col>
                    </Row>

                    {mostarBotonRetransmision && <BotonRetransmitir transmision={tx} jwt={jwt} onPedidoModificado={ejecutarConsulta} />}
                    <DetallesPedido transmision={tx} />
                    <DetallesDuplicado transmision={tx} />
                    <DetallesConfirmacion transmision={tx} />
                </div>

                <DetallesHttp transmision={tx} />
                <DetallesSap transmision={tx} />

            </>
        )
    } else {
        return (

            <Container fluid>
                Cargando ...
                <DepuradorAPI id='VisorTransmisiones' query={{ filter: { _id: txId } }} resultado={resultado} />)
            </Container>
        )
    }

}

/*


INFORMACION DE TRANSMISION
    - autenticacion


INFORMACION DE PEDIDO
    - direccion envio
    - aplazamiento
    - observaciones
    - notificaciones
    - lineas:
        - serviciodemorado


BENCHMARKING





*/



export default VisorTransmision;