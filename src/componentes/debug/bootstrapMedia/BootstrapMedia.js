import K from 'K';

import React from 'react';
import { Badge } from 'react-bootstrap';


import './BootstrapMedia.scss';


const BootstrapMedia = () => {
    // Nunca vamos a mostrar el elemento en producción
    if (K.PRODUCCION) return null;

    return (
        <div className="BootstrapMedia">
            <Badge variant='primary' className='d-inline-block d-sm-none'>XS</Badge>
            <Badge variant='secondary' className='d-none d-sm-inline-block d-md-none'>SM</Badge>
            <Badge variant='success' className='d-none d-md-inline-block d-lg-none'>MD</Badge>
            <Badge variant='warning' className='d-none d-lg-inline-block d-xl-none'>LG</Badge>
            <Badge variant='danger' className='d-none d-xl-inline-block'>XL</Badge>
        </div>
    );
}


export default BootstrapMedia;