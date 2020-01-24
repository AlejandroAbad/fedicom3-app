import K from 'K';
import React from 'react';

import './BarraNavegacionSuperior.scss';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { GoDashboard, GoDatabase, GoTelescope, GoPulse, GoRocket, GoGraph, GoGitMerge, GoInfo, GoSignOut, GoSettings, GoPerson } from 'react-icons/go';
import Icono from 'componentes/icono/Icono';



const BarraNavegacionSuperior = ({ jwt, expandirEn, onLogout, ...props }) => {

    expandirEn = expandirEn || 'md';

    if (!jwt) {
        return (
            <Navbar className="BarraSuperior" collapseOnSelect expand={expandirEn} bg="light" variant="light" fixed="top">
                <Navbar.Brand ><b>Fedicom 3</b></Navbar.Brand>
                <Navbar.Toggle aria-controls="barraSuperior-navegador" />
                <Navbar.Collapse id="barraSuperior-navegador" >
                    <Nav className="ml-auto">
                        {!K.PRODUCCION && <BotonNavegacion icono={GoSettings} titulo="Configuración" esconderEn={expandirEn} />}
                        <BotonNavegacion icono={GoInfo} titulo="Acerca de" esconderEn={expandirEn} />
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
                    <BotonNavegacion enlace="/transmisiones" icono={GoRocket} titulo="Transmisiones" esconderEn={expandirEn} mostrarEn="xl" />
                    <BotonNavegacion icono={GoDashboard} titulo="Estado" esconderEn={expandirEn} mostrarEn="xl" >
                        <BotonNavegacion enlace="/status/mongodb" icono={GoDatabase} titulo="Base de datos" />
                        <BotonNavegacion enlace="/status/concentradores" icono={GoPulse} titulo="Concentradores" />
                        <BotonNavegacion enlace="/status/watchdog" icono={GoTelescope} titulo="Watchdog" />
                        <BotonNavegacion enlace="/status/balanceadores" icono={GoGitMerge} titulo="Balanceadores" />
                        <BotonNavegacion enlace="/status/estadisticas" icono={GoGraph} titulo="Estadísticas de pedidos" />
                    </BotonNavegacion>

                </Nav>
                <Nav>
                    <MenuUsuario onLogout={onLogout} jwt={jwt} />
                </Nav>
                <Nav>
                    {!K.PRODUCCION && <BotonNavegacion icono={GoSettings} titulo="Configuración" esconderEn={expandirEn} />}
                    <BotonNavegacion icono={GoInfo} titulo="Acerca de" esconderEn={expandirEn} />
                </Nav>
            </Navbar.Collapse>

        </Navbar>
    )
}


const MenuUsuario = ({ onLogout, ...props }) => {

    let jwt = props.jwt;
    if (!jwt) return null;
    return (
        <BotonNavegacion icono={GoPerson} titulo={<>{jwt.data.sub}@{jwt.data.aud}&nbsp;</>} className="MenuUsuario mr-3 border-lg rounded" esconderEn="md" mostrarEn="lg">
            <BotonNavegacion titulo="Cuenta" enlace="/usuario" icono={GoInfo} />
            <BotonNavegacion titulo="Cerrar sesión" enlace="#" icono={GoSignOut} onClick={onLogout} />
        </BotonNavegacion>
    )

}


const BotonNavegacion = ({ icono, className, esconderEn, mostrarEn, titulo, enlace, ...props }) => {

    let elementoIcono = icono ? <Icono icono={icono} posicion={[20, 3]} /> : null;

    let navClassName = 'BotonNavegacion ' + (className ?? '');
    let textClassName = 'TextoBotonNavegacion';
    if (esconderEn) textClassName += ' d-' + esconderEn + '-none';
    if (mostrarEn) textClassName += ' d-' + mostrarEn + '-inline-block';



    if (props.children) {
        return (
            <Nav.Item className={navClassName} {...props} >
                <NavDropdown rootCloseEvent='click' title={<span>{elementoIcono}<span className={textClassName}> {titulo}</span></span>}>
                    {props.children}
                </NavDropdown>
            </Nav.Item >
        );
    }

    enlace = enlace ?? '#'

    return (
        <Nav.Item className={navClassName} {...props}>
            {enlace ?
                <LinkContainer to={enlace}><Nav.Link>{elementoIcono}<span className={textClassName}> {titulo}</span></Nav.Link></LinkContainer>
                :
                <Nav.Link>{elementoIcono}<span className={textClassName}> {titulo}</span></Nav.Link>
            }
        </Nav.Item>
    );
}

export default BarraNavegacionSuperior;