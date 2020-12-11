import K from 'K';
import React from 'react';

import './BarraNavegacionSuperior.scss';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { GoDashboard, GoRocket, GoPulse, GoInfo, GoSignOut, GoSettings, GoPerson, GoGitMerge, GoDatabase } from 'react-icons/go';
import { FaPaperPlane, FaFlask, FaBook, FaQuora } from 'react-icons/fa'
import { IoMdPlanet } from 'react-icons/io'
import { MdSchool } from 'react-icons/md';
import { GiNuclearBomb } from 'react-icons/gi';
import { FiPackage } from 'react-icons/fi';

import Icono from 'componentes/icono/Icono';




const BarraNavegacionSuperior = ({ jwt, expandirEn, onLogout, ...props }) => {

    expandirEn = expandirEn || 'md';

    let temaBarra = "BarraSuperior bg-dark-soft"
    let titulo = <b>Fedicom 3</b>

    if (!jwt) {
        return (
            <Navbar className={temaBarra} collapseOnSelect expand={expandirEn} variant="light" fixed="top">
                <Navbar.Brand >{titulo}</Navbar.Brand>
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
        <Navbar className={temaBarra} collapseOnSelect expand={expandirEn} variant="light" fixed="top">
            <Navbar.Brand >{titulo}</Navbar.Brand>
            <Navbar.Toggle aria-controls="barraSuperior-navegador" />
            <Navbar.Collapse id="barraSuperior-navegador" >
                <Nav className="mr-auto ml-10" >
                    <BotonNavegacion enlace="/transmisiones" icono={FaPaperPlane} titulo="Transmisiones" esconderEn={expandirEn} mostrarEn="xl" />
                    <BotonNavegacion icono={GoDashboard} titulo="Estado" esconderEn={expandirEn} mostrarEn="xl" >
                        <BotonNavegacion enlace="/estado/dashboard" icono={GoDashboard} titulo="Estado general del servicio" />
                        <BotonNavegacion enlace="/estado/mongodb" icono={GoDatabase} titulo="Base de datos" />
                        <BotonNavegacion enlace="/estado/procesos" icono={GoPulse} titulo="Procesos" />
                        {<BotonNavegacion enlace="/estado/balanceadores" icono={GoGitMerge} titulo="Balanceadores" />}
                        {/*<BotonNavegacion enlace="/status/estadisticas" icono={GoGraph} titulo="Estadísticas de pedidos" />*/}
                    </BotonNavegacion>

                    <BotonNavegacion icono={FaFlask} titulo="Simuladores" esconderEn={expandirEn} mostrarEn="xl" >
                        {!K.PRODUCCION && <BotonNavegacion enlace="/simulador/pedidos" icono={GoRocket} titulo="Pedidos" />}
                        {!K.PRODUCCION && <BotonNavegacion enlace="/simulador/devoluciones" icono={IoMdPlanet} titulo="Devoluciones" />}
                        {!K.PRODUCCION && <BotonNavegacion enlace="/simulador/logistica" icono={FiPackage} titulo="Logística" />}


                        <BotonNavegacion icono={FaFlask} titulo="Consultas" esconderEn={expandirEn} mostrarEn="xl" >
                            <BotonNavegacion enlace="/simulador/consulta/pedidos" icono={FaQuora} titulo="Consulta pedidos" disabled />
                            <BotonNavegacion enlace="/simulador/consulta/devoluciones" icono={FaQuora} titulo="Consulta devoluciones"  />
                            <BotonNavegacion enlace="/simulador/consulta/albaranes" icono={FaQuora} titulo="Consulta albaranes" />
                            <BotonNavegacion enlace="/simulador/consulta/facturas" icono={FaQuora} titulo="Consulta facturas" disabled />
                            <BotonNavegacion enlace="/simulador/consulta/logistica" icono={FaQuora} titulo="Consulta logistica" disabled />
                        </BotonNavegacion>

                        {!K.PRODUCCION && <BotonNavegacion enlace="/simulador/pruebaCarga" icono={GiNuclearBomb} titulo="Prueba de carga" />}
                        {/*<BotonNavegacion enlace="/simulador/stress" icono={FaMeteor} titulo="Stress" />*/}
                    </BotonNavegacion>


                    <BotonNavegacion icono={MdSchool} titulo="Documentación" esconderEn={expandirEn} mostrarEn="xl" >
                        <BotonNavegacion enlace="/doc/manual" icono={FaBook} titulo="Manuales" />
                    </BotonNavegacion>

                </Nav>
                <Nav>
                    <MenuUsuario onLogout={onLogout} jwt={jwt} />
                </Nav>
                <Nav>
                    {!K.PRODUCCION && <BotonNavegacion icono={GoSettings} titulo="Configuración" esconderEn={expandirEn} />}
                    {!K.PRODUCCION && <BotonNavegacion icono={GoInfo} titulo="Acerca de" esconderEn={expandirEn} />}
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
        <Nav.Item className={navClassName} >
            {enlace ?
                <LinkContainer to={enlace}><Nav.Link {...props}>{elementoIcono}<span className={textClassName}> {titulo}</span></Nav.Link></LinkContainer>
                :
                <Nav.Link {...props}>{elementoIcono}<span className={textClassName}> {titulo}</span></Nav.Link>
            }
        </Nav.Item>
    );
}

export default BarraNavegacionSuperior;