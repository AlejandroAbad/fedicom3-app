import React from 'react';

const VisorTransmision = (props) => {

    return (
        <h1>{props.match.params.txId}</h1>
    )
}


export default VisorTransmision;