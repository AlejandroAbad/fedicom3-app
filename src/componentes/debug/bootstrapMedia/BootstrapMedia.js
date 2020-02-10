import K from 'K';
import React from 'react';


import './BootstrapMedia.scss';


const BootstrapMedia = () => {
    // Nunca vamos a mostrar el elemento en producción
    if (K.PRODUCCION) return null;

    let cartelDesarrollo = <>
        <code className="ml-2 font-weight-bold text-reset">ENTORNO DE DESARROLLO</code>
        <br /><small className="text-muted"><small>{K.DESTINOS.CORE}</small></small>
    </>

    return (
        <div className="BootstrapMedia text-center" style={{lineHeight: '10px'}}>
            <div className='d-inline-block d-sm-none text-monospace'>
                <code className='text-monospace text-primary'>XS</code>{cartelDesarrollo}
            </div>
            <div className='d-none d-sm-inline-block d-md-none text-monospace'>
                <code className='text-monospace text-secondary'>SM</code>{cartelDesarrollo}
            </div>
            <div className='d-none d-md-inline-block d-lg-none text-monospace'>
                <code className='text-monospace text-success'>MD</code>{cartelDesarrollo}
            </div >
            <div className='d-none d-lg-inline-block d-xl-none text-monospace'>
                <code className='text-monospace text-warning'>LG</code>{cartelDesarrollo}
            </div >
            <div className='d-none d-xl-inline-block text-monospace'>
                <code className='text-monospace text-danger'>XL</code>{cartelDesarrollo}
            </div >
        </div>
    );
}


export default BootstrapMedia;