import K from 'K';
import React from 'react';

import './BarraNavegacionSuperior.scss';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { GoDashboard, GoDatabase, GoTelescope, GoPulse, GoRocket, GoGraph, GoGitMerge, GoInfo, GoSignOut, GoSettings, GoPerson } from 'react-icons/go';



const BarraNavegacionSuperior = (props) => {

    let expandirEn = props.expandirEn || 'md';

    if (!props.jwt) {
        return (
            <Navbar className="BarraSuperior" collapseOnSelect expand={expandirEn} bg="light" variant="light" fixed="top">
                <Navbar.Brand ><b>Fedicom 3</b></Navbar.Brand>
                <Navbar.Toggle aria-controls="barraSuperior-navegador" />
                <Navbar.Collapse id="barraSuperior-navegador" >
                    <Nav className="ml-auto">
                        {!K.PRODUCCION && <BotonNavegacion icon={GoSettings} title="Configuración" hideTextAt={expandirEn} />}
                        <BotonNavegacion icon={GoInfo} title="Acerca de" hideTextAt={expandirEn} />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

    return (
        <Navbar className="BarraSuperior" collapseOnSelect expand={expandirEn} bg="light" variant="light" fixed="top">
            <Navbar.Brand ><b>Fedicom 3</b></Navbar.Brand>
            <Navbar.Toggle aria-controls="barraSuperior-navegador" />
            <Navbar.Collapse id="barraSuperior-navegador" >
                <Nav className="mr-auto ml-10" >
                    <BotonNavegacion to="/transmisiones" icon={GoRocket} title="Transmisiones" hideTextAt={expandirEn} />
                    <BotonNavegacion icon={GoDashboard} title="Estado" hideTextAt={expandirEn}>
                        <BotonNavegacion to="/status/mongodb" icon={GoDatabase} title="Base de datos" />
                        <BotonNavegacion to="/status/concentradores" icon={GoPulse} title="Concentradores" />
                        <BotonNavegacion to="/status/watchdog" icon={GoTelescope} title="Watchdog" />
                        <BotonNavegacion to="/status/balanceadores" icon={GoGitMerge} title="Balanceadores" />
                        <BotonNavegacion to="/status/estadisticas" icon={GoGraph} title="Estadísticas de pedidos" />
                    </BotonNavegacion>

                </Nav>
                <Nav>
                    <MenuUsuario onLogout={props.onLogout} jwt={props.jwt} />
                </Nav>
                <Nav>
                    {!K.PRODUCCION && <BotonNavegacion icon={GoSettings} title="Configuración" hideTextAt={expandirEn} />}
                    <BotonNavegacion icon={GoInfo} title="Acerca de" hideTextAt={expandirEn} />
                </Nav>
            </Navbar.Collapse>

        </Navbar>
    )
}


const MenuUsuario = (props) => {

    let jwt = props.jwt;

    if (!jwt) return null;


    return (
        <BotonNavegacion icon={GoPerson} title={<>{jwt.data.sub}@{jwt.data.aud}&nbsp;</>} className="MenuUsuario mr-3 border rounded ">
            <BotonNavegacion title="Cuenta" to="/usuario" icon={GoInfo} />
            <BotonNavegacion title="Cerrar sesión" to="#" icon={GoSignOut} onClick={props.onLogout} />
        </BotonNavegacion>
    )

}


const BotonNavegacion = (props) => {
    let icon = null;
    if (props.icon) {
        icon = new props.icon({
            size: '20px',
            style: {
                marginBottom: '3px'
            }
        });
    }

    let navClassName = 'BotonNavegacion ' + props.className;

    let textClassName = 'TextoBotonNavegacion';
    if (props.hideTextAt)
        textClassName += ' d-' + props.hideTextAt + '-none';



    if (props.children) {
        let uid = 'nav' + Math.floor(Math.random() * 1000000)
        return (
            <Nav.Item className={navClassName} onClick={props.onClick}>
                <NavDropdown rootCloseEvent='click' title={<span>{icon}<span className={textClassName}> {props.title}</span></span>} id={uid}>
                    {props.children}
                </NavDropdown>
            </Nav.Item >
        );
    }

    return (
        <Nav.Item className={navClassName} onClick={props.onClick}>
            {props.to ?
                <LinkContainer to={props.to}><Nav.Link>{icon}<span className={textClassName}> {props.title}</span></Nav.Link></LinkContainer>
                :
                <Nav.Link>{icon}<span className={textClassName}> {props.title}</span></Nav.Link>
            }
        </Nav.Item>
    );
}

export default BarraNavegacionSuperior;