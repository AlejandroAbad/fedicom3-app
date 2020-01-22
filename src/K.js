import React from 'react'
import { GiMedicines } from 'react-icons/gi'
import { MdControlPointDuplicate, MdBugReport, MdAirplanemodeActive, MdPortableWifiOff, MdTimer } from 'react-icons/md'
import { FaDatabase, FaRetweet, FaPercentage, FaCreativeCommonsNc, FaRadiation } from 'react-icons/fa'


const K = {
    PRODUCCION: false,
    DESTINOS: {
        CORE: 'https://fedicom3-dev.hefame.es',
        MONITOR: 'https://cpd25.hefame.es:8443'
    },
    AVISO_JWT_PROXIMO_A_CADUCAR: 60 * 5,
    ALMACENES: {
        RG01: 'Santomera',
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
    ESTADOS_TRANSFERENCIA: {
        '1010': [1010, 'Recepcionada', 'Transmisión recepcionada en el concentrador, pendiente de procesar.', 'secondary'],
        '1020': [1020, 'Esperando incidencias', 'Transmisión enviada a SAP, a la espera de recibir incidencias.', 'secondary'],
        '1030': [1030, 'Incidencias recibidas', 'Transmisión procesada por SAP, pendiente responder al cliente.', 'secondary'],
        '3010': [3010, 'Fallo autenticación', 'La transmisión no se procesa porque falló la autenticación de la misma', 'warning'],
        '3020': [3020, 'Petición incorrecta', 'La transmisión contiene errores, no se puede tramitar', 'warning'],
        '3110': [3110, 'No SAP', 'Transmisión aceptada y procesada en el concentrador, pero no se pudo contactar con SAP', 'danger'],
        '3120': [3120, 'Rechazado por SAP', 'SAP ha rechazado la transmisión y ha devuelto un error de precondición', 'warning'],
        '8010': [8010, 'Incidencias enviadas', 'Transmisión completada y faltas enviadas. A la espera de confirmación final por SAP.', 'success'],
        '8100': [8100, 'Espera agotada', 'SAP tarda demasiado en devolver número de pedido.', 'danger'],
        '9000': [9000, 'Error interno', 'Ocurrió un error al tratar la transmisión y se devolvió un error 500', 'danger'],
        '9001': [9001, 'Sistema SAP invalido', 'Se intentó lanzar la petición contra un sistema SAP no definido', 'danger'],
        '9002': [9002, 'Imposible retransmitir', 'No es posible retransmitir debido al estado de la transmisión original', 'warning'],
        '9003': [9003, 'Retransmision no forzada', 'Solo se puede retransmitir si se fuerza', 'warning'],
        '9004': [9004, 'Pedido inexistente', 'No existe el pedido consultado', 'warning'],
        '9110': [9110, 'Descartada', 'Transmisión descartada por no ser legible', 'default'],
        '9120': [9120, 'Duplicado', 'La transmisión es un duplicado de otra anterior', 'primary'],
        '9130': [9130, 'Confirmacion recuperada', 'La confirmación se ha recuperado y se ha actualizado el pedido que confirma', 'success'],
        '9140': [9140, 'Sin número de pedido', 'El pedido ha entrado en SAP, pero este no ha devuelto un número de pedido', 'danger'],
        '9900': [9900, 'Ok', 'Transmisión procesada con éxito', 'success']
    },
    TIPOS_TRANSFERENCIA: {
        999: [999, 'Inválido', 'Transmisión de tipo desconocido', 'danger'],
        0: [0, 'Autenticación', 'Solicitud de autenticación de usuario', 'success'],
        10: [10, 'Crear pedido', 'Creación de un nuevo pedido', 'primary'],
        11: [11, 'Consulta pedido', 'Consulta de un pedido', 'info'],
        12: [12, 'Pedido duplicado', 'Pedido duplicado', 'info'],
        13: [13, 'Confirmación Pedido', 'SAP confirma la creación del pedido', 'info'],
        14: [14, 'Retransmitir Pedido', 'Reenvío a SAP de un pedido', 'info'],
        20: [20, 'Crear devolucion', 'Creación de una devolución', 'secondary'],
        21: [21, 'Consulta devolucion', 'Consulta de una devolución', 'info'],
        22: [22, 'Devolución duplicada', 'Devolución duplicada', 'info'],
        30: [30, 'Búsqueda de albaranes', 'Búsqueda de albaranes', 'info'],
        31: [31, 'Consulta albarán', 'Transmisión de tipo desconocido', 'info'],
        40: [40, 'Búsqueda de facturas', 'Búsqueda de facturas', 'info'],
        41: [41, 'Consulta factura', 'Transmisión de tipo desconocido', 'info']
    },
    FLAGS: {
        sqlite: { variante: "danger", titulo: "SQLite", icono: FaDatabase, descripcion: "La transmisión ha sido almacenada temporalmente en la base de datos SQLite y posteriormente migrada a MongoDB.", tecnico: true },
        retransUpd: { variante: "info", titulo: "Actualizado", icono: FaRetweet, descripcion: "El pedido ha sido retransmitido a SAP y esto ha provocado que los datos de este varíen." },
        retransNoUpd: { variante: "danger", titulo: "Retransmitido", icono: FaRetweet, descripcion: "El pedido ha sido retransmitido a SAP, pero este no se ha visto modificado." },
        watchdog: { variante: "warning", titulo: "Recuperado", icono: MdBugReport, descripcion: "El estado del pedido ha sido recuperado por el WatchDog.", tecnico: true },
        noSap: { variante: "danger", titulo: "Sin faltas", icono: MdPortableWifiOff, descripcion: "No se devolvieron faltas para este pedido." },
        estupe: { variante: "success", titulo: "Estupe", icono: GiMedicines, descripcion: "El pedido contiene algún producto estupefaciente." },
        dupes: { variante: "warning", titulo: "Duplicados", icono: MdControlPointDuplicate, descripcion: "Esta transmisión se ha sido recibido varias veces. El resto de transmisiones se marcaron como duplicadas." },
        bonif: { variante: "success", titulo: "Bonificado", icono: FaPercentage, descripcion: "El pedido contiene líneas bonificadas." },
        transfer: { variante: "primary", titulo: "Transfer", icono: MdAirplanemodeActive, descripcion: "El pedido lo realiza un laboratorio." },
        faltaTotal: { variante: "secondary", titulo: "Falta Total", icono: FaCreativeCommonsNc, descripcion: "Todas las líneas del pedido son falta total. No se servirá nada." },
        formato: { variante: "warning", titulo: "Formato", icono: FaRadiation, descripcion: (<span>La transmisión tiene incidencias de forma. Por ejemplo, campos de tipo numérico que se mandan como texto (<code>"1"</code> en lugar de <code>1</code>) o fechas mal formateadas.</span>), tecnico: true },
        demorado: { variante: "primary", titulo: "Demorado", icono: MdTimer, descripcion: (<span>El pedido contiene al menos una línea donde se ha sugerido un envío demorado.</span>) },
    },
    PROGRAMAS_FARMACIA: {
        10: 'FARMABRAIN',
        12: 'UNYCOPWIN', // UNYCOP
        26: 'HEFAME',
        28: 'FARMALOG',
        36: 'NOVOPHAR',
        38: 'FARMATIC', // CONSOFT
        48: 'NIXFARMA', // PULSO
        59: 'TEDIFARMA', // COFARES
        61: 'TEDIFARMA 2', // COFARES
        9000: 'PostMan',
        9700: 'App Empleado',
        9800: 'F+Online',
        9991: 'SAP D01',
        9992: 'SAP T01',
        9993: 'SAP P01',
        9999: 'Simulador'
    }
}

export default K