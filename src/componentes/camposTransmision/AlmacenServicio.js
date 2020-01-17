import React from 'react';

import { FaWarehouse } from 'react-icons/fa';


const getNombreAlmacen = (codigo) => {
    switch(codigo) {
        case 'RG01': return 'Santomera';
        case 'RG03': return 'Cartagena';
        case 'RG04': return 'Madrid';
        case 'RG05': return 'Barcelona viejo';
        case 'RG06': return 'Alicante';
        case 'RG07': return 'Almería';
        case 'RG08': return 'Albacete';
        case 'RG09': return 'Málaga viejo';
        case 'RG10': return 'Valencia';
        case 'RG13': return 'Madrid viejo';
        case 'RG15': return 'Barcelona';
        case 'RG16': return 'Tortosa';
        case 'RG17': return 'Melilla';
        case 'RG18': return 'Granada';
        case 'RG19': return 'Malaga';
        default: return <span className="text-warning">Desconocido</span>
    }
}


const AlmacenServicio = (props) => {

    let { transmision: tx, formato} = props
    

    let almacenSolicitado = (tx && tx.clientRequest && tx.clientRequest.body) ? tx.clientRequest.body.codigoAlmacenServicio : null;
    let almacenElegido = (tx && tx.clientResponse && tx.clientResponse.body) ? tx.clientResponse.body.codigoAlmacenServicio : null;
    
    if (!almacenElegido && !almacenSolicitado) return null;

    if (formato === 'corto') {
        let nombreAlmacen = getNombreAlmacen(almacenElegido);
        if (!nombreAlmacen.substring) {
            // Si no es string
            return <code className="text-reset"><FaWarehouse size={18} className="text-info" style={{ paddingBottom: '3px' }} />
                <abbr className="ml-1 text-decoration-none text-warning" title="Desconocido">{almacenElegido}</abbr>
            </code>;
        }
        return <code className="text-reset"><FaWarehouse size={18} className="text-info" style={{ paddingBottom: '3px' }} />
            <abbr className="ml-1 text-decoration-none" title={getNombreAlmacen(almacenElegido)}>{almacenElegido}</abbr>
        </code>;
    }

    if (almacenSolicitado === almacenElegido || !almacenElegido) {
        return <code className="text-reset"><FaWarehouse size={18} className="text-info" style={{ paddingBottom: '3px' }} />
            <abbr className="ml-1 text-decoration-none" title={almacenSolicitado}>{getNombreAlmacen(almacenSolicitado)}</abbr>
        </code>;
    } else {
        return <code className="text-reset">
            <FaWarehouse size={18} className="text-info" style={{ paddingBottom: '3px' }} />
            <abbr className="ml-1 text-decoration-none" title={almacenElegido}>{getNombreAlmacen(almacenElegido)}</abbr>
            {' '}<del className="text-muted mr-1">{almacenSolicitado}</del>
        </code>;
    }
    


}

export default AlmacenServicio;