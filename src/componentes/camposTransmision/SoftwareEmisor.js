import React from 'react';
import { FaLaptopMedical } from 'react-icons/fa';


const PROGRAMAS_FARMACIA = {
    10: 'FARMABRAIN',
    12: 'UNYCOPWIN', // UNYCOP
    26: 'HEFAME',
    28: 'FARMALOG',
    36: 'NOVOPHAR',
    38: 'FARMATIC', // CONSOFT
    48: 'NIXFARMA', // PULSO
    59: 'TEDIFARMA', // COFARES
    61: 'TEDIFARMA 2', // COFARES
    9000: 'POSTMAN',
    9700: 'APP EMPLEADO',
    9800: 'F+ONLINE',
    9991: 'SAP D01',
    9992: 'SAP T01',
    9993: 'SAP P01',
    9999: 'APP FEDICOM3 PHP'
}
const getNombreProgramaFarmacia = (idPrograma) => {
    return PROGRAMAS_FARMACIA[parseInt(idPrograma)] || 'DESCONOCIDO'; 
}


const SoftwareEmisor = (props) => {

    let swId = props.softwareId;
    if (!swId) 
        return (<>
            <FaLaptopMedical className="text-info" />
            <code className="text-danger"><span className="text-decoration-none" > No especificado</span></code>
        </>);

    return (<>
        <FaLaptopMedical className="text-info" />
        <code className="text-reset"><abbr className="text-decoration-none" title={props.softwareId}> {getNombreProgramaFarmacia(props.softwareId)}</abbr></code>
    </>);
}

export default SoftwareEmisor;