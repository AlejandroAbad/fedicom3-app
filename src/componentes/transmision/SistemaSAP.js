import K from 'K'
import React from 'react'

import { Badge } from 'react-bootstrap'


const SistemaSAP = ({ transmision, className, ...props}) => {

    let sistemaSAP = transmision.sapRequest?.body?.sapSystem;
    let cName = (className ?? '') + ' EtiquetaSistemaSAP'

    return (
        < Badge {...props} size="lg" variant="danger" className={cName}> {sistemaSAP }</Badge >
    )
}


SistemaSAP.modificado = ( tx ) => {
    return (tx.sapRequest?.body?.sapSystem && tx.sapRequest?.body?.sapSystem !== (K.PRODUCCION ? 'P01' : 'T01'))
}

export default SistemaSAP