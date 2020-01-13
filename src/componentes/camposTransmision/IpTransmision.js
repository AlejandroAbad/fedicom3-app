import React from 'react';
import { FaNetworkWired } from 'react-icons/fa';

const IpTransmision = (props) => {
    
    if (props.ip && props.ip.startsWith('') )

        return (<><FaNetworkWired className="text-info" /> <code className="text-reset" >{props.ip}</code></>);
}

export default IpTransmision;