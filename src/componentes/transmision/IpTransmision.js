import React from 'react'
import { FaNetworkWired } from 'react-icons/fa'

import Icono from 'componentes/icono/Icono'

const IpTransmision = ({ ip, ...props }) => {

    if (ip) {
        if (ip.startsWith('::ffff:')) ip = ip.substring(7);
        return (
            <>
                <Icono icono={FaNetworkWired} posicion={[16, 0]} className="text-info mr-1" />
                <code className="text-reset" >{ip}</code>
            </>
        )
    } else {
        return (
            <>
                <Icono icono={FaNetworkWired} posicion={[16, 0]} className="text-info mr-1" />
                <code className="text-warning" >Desconocido</code>
            </>
        )
    }

}

export default IpTransmision