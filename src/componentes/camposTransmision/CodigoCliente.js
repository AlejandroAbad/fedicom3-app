import React from 'react';



const LABORATORIOS = {
    '60200357': 'INDAS',
    '60200614': 'PFIZER',
    '60200118': 'CINFA',
    '60201909': 'STADA',
    '60202977': 'TEVA',
    '60201230': 'MEDA-PHARMA',
    '60203056': 'QUALIGEN',
    '60202713': 'KERN',
    '60202056': 'RATIOPHARM',
    '60203087': 'ACTAVIS',
    '60202004': 'ITALFARMACO',
    '60202331': 'RINTER',
    '60202979': 'RINTER CORONA',
    '60202707': 'IODES',
    '60200002': 'ABBOT PEDIASURE',
    '60200561': 'NORMON',
    '60203123': 'Lab60203123',
    '60203226': 'PFIZER_2',
    '60200767': 'HARTMANN',
    '60203449': 'ABBOT-BGP',
    '60202422': 'MABOFARMA',
    '60202740': 'APOTEX',
    '60203401': 'Lab60203401',
    '60200282': 'SANDOZ',
    '60202659': 'BEXAL',
    '60203016': 'Lab60203016',
    '60202637': 'Lab60202637',
    '60200223': 'ESTEVE',
    '60202374': 'EFFIK',
    '60202256': 'Lab60202256',
    '60202257': 'Lab60202257',
    '60202833': 'MYLAN',
    '60200253': 'FERRER INTERNACIONAL',
    '60200020': 'DAIICHI-SANKYO',
    '60202430': 'OMEGA-PHARMA'
}

const VKORG = {
    '101': ['HF01', 'Hefame'],
    '2901': ['BF01', 'Borginofarma'],
    '180': ['FM01', 'Famesa'],
    '309': ['IT01', 'Interapothek']
}

const getNombreLaboratorio = (codigoLaboratorio) => {
    return LABORATORIOS[codigoLaboratorio] || 'Desconocido';
}

const getTextoTipoTransfer = (tipoTransfer) => {
    switch (tipoTransfer) {
        case 'TG': return 'Transfer Gratuito';
        case 'TP': return 'Transfer Portal';
        default: return 'Transfer Normal';
    }
}

const getSociedad = (codigo) => {
    return VKORG[codigo] || ['????', 'Desconocida'];
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

    equals( otro ) {
        return (this.codigoComparable === otro.codigoComparable ) ;
    }


}

const TextoMuteado = (props) => {
    if (!props.texto) return null;
    let {className, style, ...rest}  = props;

    className = 'font-italic ' + className;
    if (!style) style = {};
    style.opacity = 0.35;
    style.letterSpacing = '-0.05em';
    
    return <span {...rest} className={className} style={style}>{props.texto}</span>;
}
const TextoSociedad = (props) => {
    return <abbr title={'Sociedad: ' + props.codigoSap + ' - ' + props.nombre} className="text-decoration-none">{props.codigo}</abbr>
}

export const TextoCodigoCliente = (props) => {

    let codigoCliente = props.codigo;
    if (typeof codigoCliente === 'string' || codigoCliente instanceof String)
        codigoCliente = new CodigoCliente(codigoCliente);
    else
        

    if (codigoCliente.isLiteral()) {
        return <code className="text-reset">{codigoCliente.codigoCliente}</code>
    }

    if (codigoCliente.isSoloCliente()) {
        return <code className="text-reset">
            <TextoMuteado texto={codigoCliente.cerosIniciales} />
            {codigoCliente.codigoCliente}
            <TextoMuteado className="" texto={codigoCliente.acabaEnHefame ? '@hefame' : null} />
        </code>
    }

    if (codigoCliente.isClienteSociedad()) {
        return <code className="text-reset">
            <TextoMuteado texto={codigoCliente.cerosIniciales} />
            <TextoSociedad codigo={codigoCliente.codigoSociedad} codigoSap={codigoCliente.codigoSociedadSap} nombre={codigoCliente.nombreSociedad} />
            {codigoCliente.codigoCliente.padStart(5, '0')}
            <TextoMuteado style={{ fontSize: '90%' }} texto={codigoCliente.acabaEnHefame ? '@hefame' : null} />
        </code>
    }

    if (codigoCliente.isLaboratorio()) {
        return (
            <>
                <code className="text-reset">
                    <abbr className="font-weight-bold text-dark text-decoration-none" title={codigoCliente.nombreTipoTransfer}>{codigoCliente.tipoTransfer}</abbr>
                    {/*codigoCliente.codigoLaboratorio*/}
                </code>&nbsp;<code>{codigoCliente.nombreLaboratorio}</code>
            </>);

    }

    return <code className="text-reset text-muted font-italic" style={{ fontVariant: 'small-caps' }}>Sin identificar</code>;

}
