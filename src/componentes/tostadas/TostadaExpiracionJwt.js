import K from 'K';
import React, {useState, useEffect, useRef} from 'react';
import {Toast, Button} from 'react-bootstrap';
import {GoIssueReopened, GoSync} from 'react-icons/go'

import useInterval from 'util/useInterval';

const TostadaExpiracionJwt = (props) => {

    const [descartada, setDescartada] = useState(false);
    const [jwtTTL, setJwtTTL] = useState(0);
    const jwtRef = useRef(props.jwt);

    useEffect(() => {
        if (props.jwt !== jwtRef.current) {
            jwtRef.current = props.jwt;
            setDescartada(false);
            setJwtTTL(Infinity);
        }
    }, [props.jwt]);

    useInterval(() => {
        let ttl = calculaJwtTTL(jwtRef.current);
        if (ttl <= 0 && jwtRef.current) props.clearJwt();
        setJwtTTL(ttl);
      }, 1000);
    

    

    if (jwtTTL <= 0 || jwtTTL > K.AVISO_JWT_PROXIMO_A_CADUCAR) return null;


    
    return (
    <Toast style={{ minWidth: '300px' }} onClose={() => setDescartada(true)} show={!descartada} className="border border-danger">
        <Toast.Header>
            <strong className="mr-auto"><GoIssueReopened size={18} style={{paddingBottom: '3px'}} /> Desconexión</strong>
        </Toast.Header>
        <Toast.Body>
            Las credenciales exirarán en {humanizarSegundos(jwtTTL)}.
            Vuelva a logearse para obtener más tiempo.
            
                <Button variant="outline-info" onClick={props.clearJwt} size="sm" className="float-right my-2">
                    <GoSync size={18} style={{paddingBottom: '3px'}} />Renovar credenciales
                </Button>
            
        </Toast.Body>
    </Toast>);

}

const calculaJwtTTL = (jwt) => {
    if (!jwt || !jwt.data || !jwt.data.exp) return 0;
    let now = (new Date()).getTime() / 1000;
    return Math.round(jwt.data.exp - now);
}
  
const humanizarSegundos = (segundos) => {
    if (segundos < 60) return segundos + ' segundo'+(segundos>1?'s':'');
    let minutos = Math.floor(segundos/60);
    return  minutos+ ' minuto'+(minutos>1?'s':'');
}


TostadaExpiracionJwt.calculaJwtTTL = calculaJwtTTL;

export default TostadaExpiracionJwt;