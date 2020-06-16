import K from 'K';
import React, { useState } from 'react';
import { Col, Button, InputGroup, FormControl, Form, Alert, Spinner } from 'react-bootstrap';
import { GoPerson, GoKey, GoSignIn } from 'react-icons/go';
import { FaWindows, FaHome, FaClinicMedical } from 'react-icons/fa';

import useStateLocalStorage from 'util/useStateLocalStorage';
import jsonFetch from 'util/fedicomFetch';


const getIconoDeDominio = (dominio) => {
    switch (dominio) {
        case "HEFAME": return (<FaWindows />);
        case "FEDICOM": return (<FaClinicMedical />);
        case "LOCAL": return (<FaHome />);
        default: return (<FaWindows />);
    }
}


const FormularioLogin = (props) => {

    const [cargando, setCargando] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [dominio, setDominio] = useStateLocalStorage('login.dominioSeleccionado', 'HEFAME', false);

    const [errores, setErrores] = useState(null);




    const solicitaToken = () => {

        let solicitudToken = {
            debug: true,
            user: usuario,
            password: clave,
            domain: dominio
        };

        setCargando(true);
        jsonFetch(K.DESTINOS.CORE + '/authenticate', {}, null, solicitudToken)
            .catch((error) => {
                setErrores([error]);
            })
            .then((response) => {
                setCargando(false);
                if (!response) return;
                if (!response.ok) {
                    setErrores(response.body);
                } else {
                    if (response.body && response.body.auth_token) {
                        if (props.jwtUpdated) {
                            props.jwtUpdated(response.body);
                        }
                        else console.error('Se obtuvo un JWT, pero no se ha definido el callback "jwtUpdated"');
                    } else {
                        setErrores([{ codigo: 'AUTH-999', descripcion: 'La respuesta no obtuvo token' }]);
                    }
                }
            });
    }

    return (
        <Col md={11} lg={8} className="shadow m-auto py-5 p-sm-4 p-md-5 my-md-5">
            <AlertasLogin errores={errores} />
            <h3 className="mb-3">Identifíquese</h3>
            <hr className="d-none d-md-block" />

            <Form>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="input-username"><GoPerson /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl autoComplete="username" placeholder="Usuario" aria-label="Usuario" aria-describedby="input-username" value={usuario} onChange={(e) => { setUsuario(e.target.value) }} />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="input-password"><GoKey /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl autoComplete="current-password" type="password" placeholder="Contraseña" aria-label="Contraseña" aria-describedby="input-password" value={clave} onChange={(e) => { setClave(e.target.value) }} />
                </InputGroup>


                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="input-password">{getIconoDeDominio(dominio)}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control as="select" value={dominio} onChange={(e) => { setDominio(e.target.value) }}>
                        <option value="HEFAME">Usuario Windows/Citrix</option>
                        <option value="FEDICOM">Usuario Fedicom</option>
                        <option value="LOCAL">Usuario Local</option>
                    </Form.Control>
                </InputGroup>
            </Form>


            <div className="m-auto mt-2 text-center">
                { cargando ? 
                    <Button variant="link" size="lg" onClick={solicitaToken} disabled>
                        <Spinner animation="border" variant="primary" />
                    </Button>
                    :
                    <Button variant="outline-primary" size="lg" onClick={solicitaToken}>
                        <GoSignIn /> Acceder
                    </Button>
                }   
            </div>

        </Col>
    );
}


const AlertasLogin = (props) => {
    if (!props.errores || props.errores.length === 0) return null;

    let alertas = [];
    props.errores.forEach((error, index) => {
        if (error.codigo && error.descripcion) {
            alertas.push(<li key={index}>{error.descripcion} <small className="text-muted">{error.codigo}</small></li>);
        } else {
            console.log()
            alertas.push(<li key={index}>No se pudo alcanzar el servidor de autenticación</li>);
        }
    })

    return (
        <Alert variant='danger'>
            <Alert.Heading>Fallo al autenticar</Alert.Heading>
            <ul>
                {alertas}
            </ul>
        </Alert>
    )
}


export default FormularioLogin;