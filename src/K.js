import React from 'react'
import { GiMedicines, GiCardExchange } from 'react-icons/gi'
import { MdControlPointDuplicate, MdAirplanemodeActive, MdPortableWifiOff, MdTimer } from 'react-icons/md'
import { FaBug, FaDatabase, FaRetweet, FaPercentage, FaCreativeCommonsNc } from 'react-icons/fa'
import { IoIosApps } from 'react-icons/io'
import { GoGitPullRequest, GoGitBranch, GoRepoForked } from 'react-icons/go'

const PRODUCCION = process.env.REACT_APP_F3_PRODUCCION === "true" ? true : false;
const BASE_URL = process.env.REACT_APP_F3_BASEURL


const K = {
    PRODUCCION: PRODUCCION,
    DESTINOS: {
        CORE: BASE_URL,
        MONITOR: BASE_URL + '/monitor'
    },
    AVISO_JWT_PROXIMO_A_CADUCAR: 60 * 5,
    ALMACENES: {
        RG01: 'Santomera',
        RG02: 'Borgino',
        RG03: 'Cartagena',
        RG04: 'Madrid',
        RG05: 'Barcelona viejo',
        RG06: 'Alicante',
        RG07: 'Almería',
        RG08: 'Albacete',
        RG09: 'Málaga viejo',
        RG10: 'Valencia',
        RG13: 'Madrid viejo',
        RG15: 'Barcelona',
        RG16: 'Tortosa',
        RG17: 'Melilla',
        RG18: 'Granada',
        RG19: 'Malaga'
    },
    LABORATORIOS: {
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
    },
    TIPOS_TRANSFER: {
        TR: 'Transfer normal',
        TG: 'Transfer gratuito',
        TP: 'Transfer portal'
    },
    VKORG: {
        '101': ['HF01', 'Hefame'],
        '2901': ['BF01', 'Borginofarma'],
        '180': ['FM01', 'Famesa'],
        '309': ['IT01', 'Interapothek']
    },
    ESTADOS_TRANSMISION: {
        '1010': { codigo: 1010, filtrable: true, titulo: 'Recepcionada', descripcion: 'Transmisión recepcionada en el concentrador, pendiente de procesar.', variante: 'secondary' },
        '1020': { codigo: 1020, filtrable: true, titulo: 'Esperando incidencias', descripcion: 'Transmisión enviada a SAP, a la espera de recibir incidencias.', variante: 'secondary' },
        '1030': { codigo: 1030, filtrable: true, titulo: 'Incidencias recibidas', descripcion: 'Transmisión procesada por SAP, pendiente responder al cliente.', variante: 'secondary' },
        '3010': { codigo: 3010, filtrable: true, titulo: 'Fallo autenticación', descripcion: 'La transmisión no se procesa porque falló la autenticación de la misma', variante: 'warning' },
        '3011': { codigo: 3011, filtrable: true, titulo: 'No autorizado', descripcion: 'La transmisión no se procesa porque el usuario no tiene permisos para ejecutarla', variante: 'warning' },
        '3020': { codigo: 3020, filtrable: true, titulo: 'Petición incorrecta', descripcion: 'La transmisión contiene errores, no se puede tramitar', variante: 'warning' },
        '3110': { codigo: 3110, filtrable: true, titulo: 'No SAP', descripcion: 'Transmisión aceptada y procesada en el concentrador, pero no se pudo contactar con SAP', variante: 'danger' },
        '3120': { codigo: 3120, filtrable: true, titulo: 'Rechazado por SAP', descripcion: 'SAP ha rechazado la transmisión y ha devuelto un error de precondición', variante: 'warning' },
        '8010': { codigo: 8010, filtrable: true, titulo: 'Incidencias enviadas', descripcion: 'Transmisión completada y faltas enviadas. A la espera de confirmación final por SAP.', variante: 'success' },
        '8100': { codigo: 8100, filtrable: true, titulo: 'Espera agotada', descripcion: 'SAP tarda demasiado en devolver número de pedido.', variante: 'danger' },
        '9000': { codigo: 9000, filtrable: true, titulo: 'Error interno', descripcion: 'Ocurrió un error al tratar la transmisión y se devolvió un error 500', variante: 'danger' },
        '9001': { codigo: 9001, filtrable: false, titulo: 'Sistema SAP invalido', descripcion: 'Se intentó lanzar la petición contra un sistema SAP no definido', variante: 'danger' },
        '9002': { codigo: 9002, filtrable: false, titulo: 'Imposible retransmitir', descripcion: 'No es posible retransmitir debido al estado de la transmisión original', variante: 'warning' },
        '9003': { codigo: 9003, filtrable: false, titulo: 'Retransmision no forzada', descripcion: 'Solo se puede retransmitir si se fuerza', variante: 'warning' },
        '9004': { codigo: 9004, filtrable: false, titulo: 'Pedido inexistente', descripcion: 'No existe el pedido consultado', variante: 'warning' },
        '9110': { codigo: 9110, filtrable: true, titulo: 'Descartada', descripcion: 'Transmisión descartada por no ser legible', variante: 'default' },
        '9120': { codigo: 9120, filtrable: false, titulo: 'Duplicado', descripcion: 'La transmisión es un duplicado de otra anterior', variante: 'primary' },
        '9130': { codigo: 9130, filtrable: false, titulo: 'Confirmacion recuperada', descripcion: 'La confirmación se ha recuperado y se ha actualizado el pedido que confirma', variante: 'success' },
        '9140': { codigo: 9140, filtrable: true, titulo: 'Sin número de pedido', descripcion: 'El pedido ha entrado en SAP, pero este no ha devuelto un número de pedido', variante: 'danger' },
        '9900': { codigo: 9900, filtrable: true, titulo: 'Ok', descripcion: 'Transmisión procesada con éxito', variante: 'success' },

        19001: { codigo: 19001, filtrable: false, titulo: 'RTX OK', descripcion: 'Retransmisión lanzada con éxito', variante: 'success'},
        19002: { codigo: 19002, filtrable: false, titulo: 'RTX IMPONSIBLE', descripcion: 'El estado de la transmisión original no permite la retransmisión de la misma', variante: 'warning' },
        19003: { codigo: 19003, filtrable: false, titulo: 'RTX SIN FORZAR', descripcion: 'El estado de la transmisión original no permite la retransmisión de la misma salvo que se fuerce la retransmisión', variante: 'primary' }
    },
    TIPOS_TRANSMISION: {
        999: { codigo: 999, filtrable: true, titulo: 'Inválido', descripcion: 'Transmisión de tipo desconocido', variante: 'danger' },
        0: { codigo: 0, filtrable: true, titulo: 'Autenticación', descripcion: 'Solicitud de autenticación de usuario', variante: 'light' },
        10: { codigo: 10, filtrable: true, titulo: 'Crear pedido', descripcion: 'Creación de un nuevo pedido', variante: 'primary' },
        20: { codigo: 20, filtrable: true, titulo: 'Crear devolucion', descripcion: 'Creación de una devolución', variante: 'dark' },
        
        13: { codigo: 13, filtrable: true, titulo: 'Confirmación Pedido', descripcion: 'SAP confirma la creación del pedido', variante: 'light' },
        14: { codigo: 14, filtrable: false, titulo: 'Retransmitir Pedido', descripcion: 'Reenvío a SAP de un pedido', variante: 'light' },

        12: { codigo: 12, filtrable: true, titulo: 'Pedido duplicado', descripcion: 'Pedido duplicado', variante: 'secondary' },
        22: { codigo: 22, filtrable: true, titulo: 'Devolución duplicada', descripcion: 'Devolución duplicada', variante: 'secondary' },

        11: { codigo: 11, filtrable: true, titulo: 'Consulta pedido', descripcion: 'Consulta de un pedido', variante: 'info' },
        21: { codigo: 21, filtrable: true, titulo: 'Consulta devolucion', descripcion: 'Consulta de una devolución', variante: 'info' },
        30: { codigo: 30, filtrable: false, titulo: 'Búsqueda de albaranes', descripcion: 'Búsqueda de albaranes', variante: 'info' },
        31: { codigo: 31, filtrable: false, titulo: 'Consulta albarán', descripcion: 'Transmisión de tipo desconocido', variante: 'info' },
        40: { codigo: 40, filtrable: false, titulo: 'Búsqueda de facturas', descripcion: 'Búsqueda de facturas', variante: 'info' },
        41: { codigo: 41, filtrable: false, titulo: 'Consulta factura', descripcion: 'Transmisión de tipo desconocido', variante: 'info' }
    },
    FLAGS: {
        sqlite: { variante: "danger", titulo: "SQLite", icono: FaDatabase, descripcion: "La transmisión ha sido almacenada temporalmente en la base de datos SQLite y posteriormente migrada a MongoDB.", tecnico: true },
        retransUpd: { variante: "info", titulo: "Actualizado", icono: GiCardExchange, descripcion: "El pedido ha sido retransmitido a SAP y esto ha provocado que los datos de este varíen." },
        retransNoUpd: { variante: "secondary", titulo: "Retransmitido", icono: FaRetweet, descripcion: "El pedido ha sido retransmitido a SAP, pero este no se ha visto modificado." },
        retransUpdWarn: { variante: "danger", titulo: "Modificado", icono: GoGitBranch, descripcion: "La respuesta del pedido se ha visto modificada con respecto a la que se le dió originalmente a la farmacia. Es posible que las faltas hayan variado." },

        clon: { variante: "primary", titulo: "Clon", icono: GoGitPullRequest, descripcion: "Este pedido es un clon de otro pedido existente" },
        clonado: { variante: "info", titulo: "Clonado", icono: GoRepoForked, descripcion: "Este pedido ha sido retransmitido y como resultado se han generado otros pedidos" },

        statusFix1: { variante: "warning", titulo: "Fix 1", icono: FaBug, descripcion: "mdb.js: CASO CONGESTION: SAP da numero de pedido antes que MDB haga commit", tecnico: true },
        statusFix2: { variante: "warning", titulo: "Fix 2", icono: FaBug, descripcion: "mdb.js: ESPERA AGOTADA", tecnico: true },
        statusFix3: { variante: "warning", titulo: "Fix 3", icono: FaBug, descripcion: "mdb.js: CONFIRMACION RECUPERADA: La confirmación del pedido se grabó antes que el propio pedido", tecnico: true },
        // watchdog: { variante: "primary", titulo: "WatchDog", icono: FaDog, descripcion: "El estado del mensaje ha sido cambiado por el WatchDog.", tecnico: true },
        noSap: { variante: "warning", titulo: "Buffer", icono: IoIosApps, descripcion: "El mensaje no pudo ser entregado inmediatamente a SAP porque SAP no era alcanzable cuando se recibió." },
        noFaltas: { variante: "danger", titulo: "No faltas", icono: MdPortableWifiOff, descripcion: "¡ No se devolvieron faltas a la farmacia !" },
        estupe: { variante: "success", titulo: "Estupe", icono: GiMedicines, descripcion: "El pedido contiene algún producto estupefaciente." },
        dupes: { variante: "warning", titulo: "Duplicados", icono: MdControlPointDuplicate, descripcion: "Esta transmisión se ha sido recibido varias veces. El resto de transmisiones se marcaron como duplicadas." },
        bonif: { variante: "success", titulo: "Bonificado", icono: FaPercentage, descripcion: "El pedido contiene líneas bonificadas." },
        transfer: { variante: "primary", titulo: "Transfer", icono: MdAirplanemodeActive, descripcion: "El pedido lo realiza un laboratorio." },
        faltaTotal: { variante: "secondary", titulo: "Falta Total", icono: FaCreativeCommonsNc, descripcion: "Todas las líneas del pedido son falta total. No se servirá nada." },
        //formato: { variante: "warning", titulo: "Formato", icono: FaRadiation, descripcion: (<span>La transmisión tiene incidencias de forma. Por ejemplo, campos de tipo numérico que se mandan como texto (<code>"1"</code> en lugar de <code>1</code>) o fechas mal formateadas.</span>), tecnico: true },
        demorado: { variante: "primary", titulo: "Demorado", icono: MdTimer, descripcion: (<span>El pedido contiene al menos una línea donde se ha sugerido un envío demorado.</span>) },
    },
    PROGRAMAS_FARMACIA: {
        10: { codigo: '10', nombre: 'FARMABRAIN', filtrable: true},
        12: { codigo: '0012', nombre: 'UNYCOPWIN', apellidos: 'UNYCOP', filtrable: true },
        26: { codigo: '26', nombre: 'HEFAME' },
        28: { codigo: '28', nombre: 'FARMALOG', filtrable: true },
        36: { codigo: '36', nombre: 'NOVOPHAR', apellidos: 'Quimfa', filtrable: true },
        38: { codigo: '38', nombre: 'FARMATIC', apellidos: 'CONSOFT', filtrable: true},
        48: { codigo: '48', nombre: 'NIXFARMA', apellidos: 'PULSO', filtrable: true },
        59: { codigo: '59', nombre: 'TEDIFARMA', apellidos: 'COFARES', filtrable: true },
        61: { codigo: '61', nombre: 'TEDIFARMA 2', apellidos: 'COFARES', filtrable: true },
        9000: { codigo: '9000', nombre: 'PostMan', filtrable: true },
        9001: { codigo: '9001', nombre: 'SIM REACT', filtrable: true },
        9002: { codigo: '9002', nombre: 'RERTANSMISOR' },
        9100: { codigo: '9100', nombre: 'TRADUCTOR F2', filtrable: true },
        9700: { codigo: '9700', nombre: 'APP EMPLEADO', filtrable: true },
        9800: { codigo: '9800', nombre: 'F+ONLINE', filtrable: true },
        9991: { codigo: '9991', nombre: 'SAP D01' },
        9992: { codigo: '9992', nombre: 'SAP T01' },
        9993: { codigo: '9993', nombre: 'SAP P01' },
        9999: { codigo: '9999', nombre: 'SIM PHP', filtrable: true }
    }
}

export default K