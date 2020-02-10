import K from 'K';

import React from 'react';
import { Badge } from 'react-bootstrap';


import './BootstrapMedia.scss';


const BootstrapMedia = () => {
    // Nunca vamos a mostrar el elemento en producción
    if (K.PRODUCCION) return null;

    let cartelDesarrollo = <code className="ml-2 font-weight-bold">ENTORNO DE DESARROLLO</code>

    return (
        <div className="BootstrapMedia">
            <div className='d-inline-block d-sm-none text-monospace'>
                <Badge variant='primary'>XS</Badge>{cartelDesarrollo}
            </div>
            <div className='d-none d-sm-inline-block d-md-none text-monospace'>
                <Badge variant='secondary'>SM</Badge>{cartelDesarrollo}
            </div>
            <div className='d-none d-md-inline-block d-lg-none text-monospace'>
                <Badge variant='success'>MD</Badge>{cartelDesarrollo}
            </div >
            <div className='d-none d-lg-inline-block d-xl-none text-monospace'>
                <Badge variant='warning'>LG</Badge>{cartelDesarrollo}
            </div >
            <div className='d-none d-xl-inline-block text-monospace'>
                <Badge variant='danger'>XL</Badge>{cartelDesarrollo}
            </div >
        </div>
    );
}


export default BootstrapMedia;