import React from 'react';
import { FaNetworkWired } from 'react-icons/fa';

const IpTransmision = (props) => {
    
    let ip = props.ip;

    if (ip) {
        if ( ip.startsWith('::ffff:') ) ip = ip.substring(7);
        return (<><FaNetworkWired className="text-info" /> <code className="text-reset" >{ip}</code></>);

    } else {
        return (<><FaNetworkWired className="text-info" /> <code className="text-danger" >Desconocido</code></>);
    }

}

export default IpTransmision;