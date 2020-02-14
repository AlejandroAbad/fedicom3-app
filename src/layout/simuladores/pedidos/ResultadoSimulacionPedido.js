import React from 'react'
import VisorTransmision from 'layout/transmisiones/visor/VisorTransmision'
import { Container, Alert } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const ResultadoSimulacionPedido = ({ jwt, resultado }) => {

    const { error, respuesta } = resultado
    
    if (!respuesta && !error) return null

    let txId = respuesta?.headers.get('X-TxId')

    return (

        <Container className="mt-5">
            <h3>Resultado de la operación: </h3>
            {txId && <Alert variant="primary">
                <strong>Nota:</strong> Es posible que los datos que se muestran a continuación no estén actualizados.<br/>
                Para acceder a los últimos resultados use este enlace <LinkContainer to={`/transmisiones/${txId}`}><Alert.Link>{txId}</Alert.Link></LinkContainer >.</Alert> }
            <hr/>
            <VisorTransmision jwt={jwt} txId={txId} deshabilitarRetransmision />
        </Container>
    )
}

export default ResultadoSimulacionPedido