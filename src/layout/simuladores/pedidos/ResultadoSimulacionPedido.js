import React from 'react'
import VisorTransmision from 'layout/transmisiones/visor/VisorTransmision'
import { Container } from 'react-bootstrap'

const ResultadoSimulacionPedido = ({ jwt, resultado }) => {

    const { error, respuesta } = resultado
    
    if (!respuesta && !error) return null

    return (
        <Container className="mt-5">
            <h3>Resultado de la operación: </h3>
            <hr/>
            <VisorTransmision jwt={jwt} txId={respuesta?.headers.get('X-TxId')} recargable />
        </Container>
    )
}

export default ResultadoSimulacionPedido