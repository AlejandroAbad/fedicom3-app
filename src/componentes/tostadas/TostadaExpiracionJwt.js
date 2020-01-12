import K from 'K';
import React, {useEffect} from 'react';
import {Toast, Button} from 'react-bootstrap';
import {GoIssueReopened, GoSync} from 'react-icons/go'

const TostadaExpiracionJwt = (props) => {

    const [descartada, setDescartada] = React.useState(false);

    const jwtRef = React.useRef(props.jwt);

    useEffect(() => {
        if (props.jwt !== jwtRef.current) {
            jwtRef.current = props.jwt;
            setDescartada(false);
        }
    }, [props.jwt])

    

    if (props.jwtTTL <= 0 || props.jwtTTL > K.AVISO_JWT_PROXIMO_A_CADUCAR) return null;


    
    return (
    <Toast style={{ minWidth: '300px' }} onClose={() => setDescartada(true)} show={!descartada} className="border border-danger">
        <Toast.Header>
            <strong className="mr-auto"><GoIssueReopened size={18} style={{paddingBottom: '3px'}} /> Desconexión</strong>
        </Toast.Header>
        <Toast.Body>
            Las credenciales exirarán en {humanizarSegundos(props.jwtTTL)}.
            Vuelva a logearse para obtener más tiempo.
            
                <Button variant="outline-info" onClick={props.clearJwt} size="sm" className="float-right my-2">
                    <GoSync size={18} style={{paddingBottom: '3px'}} />Renovar credenciales
                </Button>
            
        </Toast.Body>
    </Toast>);

}

const humanizarSegundos = (segundos) => {

    if (segundos < 60) return segundos + ' segundo'+(segundos>1?'s':'');
    let minutos = Math.floor(segundos/60);
    return  minutos+ ' minuto'+(minutos>1?'s':'');


}

export default TostadaExpiracionJwt;