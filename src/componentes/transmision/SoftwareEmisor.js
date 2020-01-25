import K from 'K'
import React from 'react'
import { FaLaptopMedical } from 'react-icons/fa'

import Icono from 'componentes/icono/Icono'

const getNombreProgramaFarmacia = (idPrograma) => {
    return K.PROGRAMAS_FARMACIA[parseInt(idPrograma)] || {codigo: idPrograma, nombre: 'Desconocido'}
}


const SoftwareEmisor = ({ softwareId, ...props }) => {

    if (!softwareId)
        return (<>
            <Icono icono={FaLaptopMedical} posicion={[16, 0]} className="text-info mr-1" />
            <code className="text-danger"><span className="text-decoration-none" > No especificado</span></code>
        </>);

    return (<>
        <Icono icono={FaLaptopMedical} posicion={[16, 0]} className="text-info mr-1" />
        <code className="text-reset"><abbr className="text-decoration-none" title={softwareId}>{getNombreProgramaFarmacia(softwareId).nombre}</abbr></code>
    </>);
}

export default SoftwareEmisor;