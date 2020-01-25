import K from 'K'
import React from 'react'

import { Row, Col } from 'react-bootstrap'
import { IoIosPerson, IoMdKey } from 'react-icons/io'

import Icono from 'componentes/icono/Icono'

const getNombreLaboratorio = (codigoLaboratorio) => {
    return K.LABORATORIOS[codigoLaboratorio] || 'Desconocido'
}

const getTextoTipoTransfer = (tipoTransfer) => {
    return K.TIPOS_TRANSFER[tipoTransfer] || 'Transfer desconocido'
}

const getSociedad = (codigo) => {
    return K.VKORG[codigo] || ['????', 'Desconocida']
}

const TextoMuteado = (props) => {
    if (!props.texto) return null;
    let { className, style, ...rest } = props;

    className = 'font-italic ' + className;
    if (!style) style = {};
    style.opacity = 0.35;
    style.letterSpacing = '-0.05em';

    return <span {...rest} className={className} style={style}>{props.texto}</span>;
}

const TextoSociedad = (props) => {
    return <abbr title={'Sociedad: ' + props.codigoSap + ' - ' + props.nombre} className="text-decoration-none">{props.codigo}</abbr>
}

export class CodigoCliente {

    constructor(codigo) {
        this.codigoOriginal = codigo;

        if (!codigo) {
            this.tipo = 'vacio';
            return;
        }

        // Los códigos de laboratorio son de la forma [TR|TG|TP]602ZZZZZ
        if (codigo.length === 10 && ['TR', 'TG', 'TP'].includes(codigo.substring(0, 2))) {
            this.tipo = 'laboratorio';
            this.codigoLaboratorio = codigo.substring(2);
            this.tipoTransfer = codigo.substring(0, 2);
            this.nombreLaboratorio = getNombreLaboratorio(this.codigoLaboratorio);
            this.nombreTipoTransfer = getTextoTipoTransfer(this.tipoTransfer);
            this.codigoComparable = this.codigoLaboratorio;
        } else {
            let codigoTmp = codigo;
            if (codigo.endsWith('@hefame')) { // Si aparece el sufijo @hefame, lo quitamos para continuar procesando el código
                this.acabaEnHefame = true;
                codigoTmp = codigo.substring(0, codigo.length - 7);
            }

            if (codigoTmp.match(/^[0-9]+$/) && codigoTmp.length <= 10) { // Si el código solo contiene numeros
                let codigoSinCeros = codigoTmp.replace(/^0+/g, ''); // Eliminamos los ceros a la izquierda 
                this.cerosIniciales = codigoTmp.substring(0, codigoTmp.length - codigoSinCeros.length); // (¡y nos guardamos cuantos había por si luego queremos pintarlos!)

                if (codigoSinCeros.length > 5 && codigoSinCeros.length <= 10) { // Es un codigo tipo [XXXX]XZZZZZ donde XXXXX es el código de la sociedad y ZZZZZ el codigo del cliente 
                    this.tipo = 'cliente+sociedad';
                    this.codigoCliente = codigoSinCeros.substring(codigoSinCeros.length - 5).replace(/^0+/g, ''); // Si la parte ZZZZZ empieza con ceros, los quitamos
                    this.codigoSociedad = codigoSinCeros.substring(0, codigoSinCeros.length - 5);
                    let datosSociedad = getSociedad(this.codigoSociedad);
                    this.codigoSociedadSap = datosSociedad[0];
                    this.nombreSociedad = datosSociedad[1];
                    this.codigoComparable = this.codigoCliente;
                } else if (codigoSinCeros.length <= 5) { // Es un codigo de cliente corto, el que suelen transmitir las farmacias. P.e: 117, 13, 20131, 7562, 2, ...
                    this.tipo = 'cliente'
                    this.codigoCliente = codigoSinCeros;
                    this.codigoComparable = this.codigoCliente;
                } else {
                    this.tipo = 'literal'
                    this.codigoCliente = this.codigoOriginal;
                    this.codigoComparable = this.codigoOriginal;
                }
            } else {
                // Los tipos literales son nombres que no coindicen con códigos SAP, por ejemplo 'F+Online', 'empleado' ...
                this.tipo = 'literal';
                this.codigoCliente = this.codigoOriginal;
                this.codigoComparable = this.codigoOriginal;
            }
        }
    }

    isVacio() {
        return this.tipo === 'vacio'
    }
    isLiteral() {
        return this.tipo === 'literal'
    }
    isLaboratorio() {
        return this.tipo === 'laboratorio'
    }
    isClienteSociedad() {
        return this.tipo === 'cliente+sociedad'
    }
    isSoloCliente() {
        return this.tipo === 'cliente'
    }

    equals(otro) {
        return (this.codigoComparable === otro.codigoComparable);
    }


}

export const TextoCodigoCliente = ({ codigoCliente, ...props }) => {


    if (!codigoCliente?.isLiteral) {
        codigoCliente = new CodigoCliente(codigoCliente);
    }


    if (codigoCliente.isLiteral()) {
        return <span className="text-monospace">{codigoCliente.codigoCliente}</span>
    }

    if (codigoCliente.isSoloCliente()) {
        return (
            <span className="text-monospace">
                <TextoMuteado texto={codigoCliente.cerosIniciales} />
                {codigoCliente.codigoCliente}
                <TextoMuteado className="" texto={codigoCliente.acabaEnHefame ? '@hefame' : null} />
            </span>
        )
    }

    if (codigoCliente.isClienteSociedad()) {
        return (
            <span className="text-monospace">
                <TextoMuteado texto={codigoCliente.cerosIniciales} />
                <TextoSociedad codigo={codigoCliente.codigoSociedad} codigoSap={codigoCliente.codigoSociedadSap} nombre={codigoCliente.nombreSociedad} />
                {codigoCliente.codigoCliente.padStart(5, '0')}
                <TextoMuteado style={{ fontSize: '90%' }} texto={codigoCliente.acabaEnHefame ? '@hefame' : null} />
            </span>
        )
    }

    if (codigoCliente.isLaboratorio()) {
        return (
            <>
                <span className="text-monospace">
                    <abbr className="font-weight-bold text-dark text-decoration-none" title={codigoCliente.nombreTipoTransfer}>{codigoCliente.tipoTransfer}</abbr>
                </span>&nbsp;<abbr className="text-monospace text-decoration-none" title={codigoCliente.codigoLaboratorio}>{codigoCliente.nombreLaboratorio}</abbr>
            </>
        )

    }

    return <span className="text-monospace text-muted font-italic" style={{ fontVariant: 'small-caps' }}>Sin identificar</span>;

}

export const UsuarioTransmision = ({ transmision, ...props }) => {

    let codigoCliente = new CodigoCliente(transmision.client);
    let usuarioAutenticado = new CodigoCliente(transmision.authenticatingUser);
    let codigoClienteSap = new CodigoCliente(transmision.sapResponse && transmision.sapResponse.body ? transmision.sapResponse.body.sap_cliente : null);

    let textoSuperior = null;
    let textoInferior = null;

    if (codigoCliente.isVacio()) {
        textoSuperior = <TextoCodigoCliente codigoCliente={usuarioAutenticado} />
    } else {

        if (!codigoClienteSap || codigoClienteSap.isVacio() || codigoCliente.codigoOriginal === codigoClienteSap.codigoOriginal) {
            textoInferior = <TextoCodigoCliente codigoCliente={codigoCliente} />
        } else {
            textoInferior = <><TextoCodigoCliente codigoCliente={codigoCliente} /> &raquo; <TextoCodigoCliente codigoCliente={codigoClienteSap} /></>
        }

        if (usuarioAutenticado.isVacio()) {
            textoSuperior = (<>
                <small className="small-caps">Sin autenticar</small>
            </>);
        } else {
            if (!codigoCliente.equals(usuarioAutenticado)) {
                textoSuperior = (<>
                    <TextoCodigoCliente codigoCliente={usuarioAutenticado} />
                    {!usuarioAutenticado.isLaboratorio() && <small className="texto-compacto"> a nombre de</small>}
                </>);
            }
        }
    }

    return (
        <Row className="p-0 m-0 no-gutters">
            {textoSuperior && <Col lg={12}><Icono icono={IoMdKey} posicion={[16, 0]} className="text-info mr-1" />{textoSuperior}</Col>}
            {textoInferior && <Col lg={12}><Icono icono={IoIosPerson} posicion={[16, 0]} className="text-info mr-1" />{textoInferior}</Col>}
        </Row>
    )

}