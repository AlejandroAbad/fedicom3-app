import K from 'K'
import React, { useState, useEffect, useCallback } from 'react'
import { Container, Button, Row, Col, Card, Table, Alert } from 'react-bootstrap'

import fedicomFetch from 'util/fedicomFetch';
import clone from 'clone';


const CODIGO_AUTENTICACION = '10104999@hefame';

const CODIGOS_CLIENTE = ["91934", "10688", "00000", "70240", "14953", "15117", "17254", "26630", "12086", "14953", "14953", "20964", "16027", "28461", "27287", "27288", "17777", "14953", "15117", "25407", "04656", "18537", "04656", "11131", "91004", "25129", "12086", "13663", "20864", "15077", "03791", "91774", "20026", "20987", "20987", "91883", "91882", "91883", "20987", "20987", "20987", "20650", "21182", "70240", "03854", "15436", "12238", "01843", "11188", "18657", "18657", "04569", "18037", "21182", "21182", "17751", "91858", "20145", "91858", "16258", "03038", "03038", "04656", "20757", "28605", "28604", "11328", "01701", "21590", "21631", "91858", "14953", "04386", "10566", "03538", "70077", "12600", "12600", "16258", "16258", "15273", "70123", "01601", "11006", "20954", "70123", "90879", "10891", "10891", "04656", "20611", "15110", "70123", "25921", "12600", "15110", "20618", "20847", "15110", "16974", "04532", "15110", "11848", "10604", "17369", "10032", "13211", "21308", "11497", "73030", "10836", "14953", "25921", "11848", "21667", "25921", "25924", "25924", "12087", "20144", "20296", "91888", "25921", "91888", "20296", "25924", "20052", "11848", "02921", "14146", "25921", "02921", "26475", "25921", "06767", "11708", "21322", "21630", "17504", "20530", "06065", "17504", "92301", "15404", "16954", "21123", "09101", "20865", "11848", "16938", "16258", "11708", "20723", "15331", "14399", "25924", "11848", "12600", "11708", "14769", "01297", "25924", "17006", "25924", "25924", "10558", "27645", "25924", "12427", "20996", "20996", "25924", "14529", "20127", "03532", "91858", "12278", "06886", "16197", "02947", "11014", "12427", "06767", "02234", "02234", "12099", "05173", "05173", "15102", "18540", "04429", "16480", "14707", "14707", "12565", "21303", "20127", "16480", "91670", "16480", "17784", "02832", "70123", "17942", "01768", "28094", "16886", "20926", "00294", "17507", "11273", "92301", "10354", "17775", "07033", "10497", "03807", "06754", "20046", "04472", "15039", "17739", "21149", "01432", "14655", "14062", "14788", "71396", "04605", "05272", "91248", "14788", "90633", "14655", "20400", "04605", "21557", "17658", "73031", "14655", "21188", "05390", "04457", "01106", "06581", "16197", "70206", "20460", "21029", "11030", "21393", "26508", "06615", "10700", "17507", "20650", "11826", "10255", "20543", "20652", "10891", "10891", "10891", "17735", "10990", "07646", "03788", "16519", "10642", "21546", "07550", "12052", "15416", "17488", "03330", "04097", "10173", "14198", "25680", "11602", "28289", "16538", "17735", "07646", "10891", "12052", "10642", "16519", "07550", "10891", "10990", "21546", "04097", "17488", "15416", "03788", "03330", "17836", "06615", "21354", "04950", "04457", "02157", "12112", "01994", "20543", "73031", "27585", "17927", "13469", "06581", "17006", "12465", "20134", "14415", "17993", "06158", "17836", "11708", "17389", "11895", "17535", "01446", "16478", "11047", "27319", "11551", "06725", "04227", "11526", "04472", "03205", "20134", "06576", "02627", "14399", "17846", "26508", "14378", "06576", "16478", "17507", "11526", "07863", "17836", "12396", "26594", "06725", "12308", "19065", "04244", "01493", "21687", "16730", "28014", "20841", "06581", "16462", "11708", "16587", "70548", "70032", "21253", "17326", "20275", "12609", "20120", "25603", "16587", "17964", "28151", "03072", "10554", "19289", "17134", "20684", "16125", "25383", "20960", "05076", "00220", "21687", "12368", "14146", "04457", "10945", "25383", "91322", "25909", "12838", "17134", "16478", "70034", "14462", "11185", "12368", "04457", "20055", "04472", "16886", "12006", "20400", "12712", "70032", "21393", "01860", "14192", "04244", "10736", "21639", "01860", "21481", "17613", "07535", "04459", "06702", "20936", "72065", "16705", "70034", "20542", "14378", "17653", "04459", "06159", "20750", "05067", "13379", "12465", "11185", "17891", "11708", "10471", "20913", "15891", "26145", "06943", "14605", "14769", "05076", "00459", "11615", "11097", "20448", "20641", "13507", "13683", "16744", "21613", "06574", "17653", "11708", "16744", "04223", "12073", "12600", "20619", "04569", "15351", "02132", "90563", "10289", "21484", "01269", "01493", "17551", "08050", "70169", "20618", "16553", "06901", "06625", "21149", "01269", "03048", "27581", "21649", "17788", "11615", "16258", "10686", "06901", "21130", "13024", "16728", "21237", "13157", "21496", "15117", "06581", "20932", "04853", "12587", "01964", "20925", "18618", "01647", "03012", "06581", "20842", "21149", "12427", "10945", "20842", "13088", "14301", "06426", "27678", "17692", "92401", "03945", "12112", "17451", "11708", "12728", "10079", "16728", "21590", "06407", "00294", "17653", "21435", "11708", "90452", "21620", "11307", "17426", "11710", "07863", "10079", "11301", "16896", "17891", "14290", "13957", "20842", "07896", "02745", "14146", "13163", "20915", "17675", "11708", "20761", "12247", "21465", "11710", "20619", "17426", "11708", "14149", "14037", "20812", "06581", "04318", "04318", "14037", "26508", "21019", "20549", "06159", "17507", "14062", "21159", "15140", "20016", "17658", "14345", "11615", "70191", "21636", "16974", "17416", "16602", "20748", "21208", "13896", "13251", "17482", "20296", "06615", "11826", "11907", "14399", "16204", "21286", "17755", "09738", "16500", "02432", "02539", "19825", "27124", "13251", "21182", "02157", "17326", "04487", "01545", "17891", "12838", "10016", "25680", "18264", "21182", "12930", "17636", "15969", "13207", "14399", "07535", "17139", "02539", "27441", "13251", "17734", "03705", "15039", "10016", "90755", "07535", "21338", "17068", "07878", "07535", "03945", "20296", "07535", "16587", "13402", "17236", "71542", "21766", "21289", "91603", "17074", "20917", "07535", "11602", "16587", "20400", "12858", "10015", "21010", "15273", "21049", "91603", "13500", "17658", "15273", "03925", "10700", "06082", "15039", "05093", "13599", "06615", "09738", "17535", "05808", "15154", "11395", "06492", "05043", "20106", "06702", "16500", "11068", "90619", "13580", "05130", "03820", "17139", "17482", "20243", "21766", "20586", "11449", "05130", "02930", "08845", "90809", "20419", "14415", "05099", "17006", "14769", "25039", "15470", "21748", "71542", "02866", "10485", "73040", "04419", "17504", "16853", "03258", "73040", "14138", "16974", "21188", "73040", "21426", "12783", "02367", "12799", "11449", "04237", "04419", "16602", "17667", "12712", "18239", "17244", "06158", "04237", "27678", "20248", "20080", "01565", "11449", "13806", "19501", "11602", "01565", "15215", "04204", "20998", "11825", "15154", "05301", "08224", "16705", "13806", "12964", "20155", "17162", "20189", "16862", "16705", "10173", "02367", "13691", "21278", "21688", "04327", "03208", "08141", "26476", "17997", "01701", "90977", "11306", "16258", "18588", "20684", "26293", "08299", "28301", "73174", "11731", "70060", "14449", "01245", "08224", "01612", "03790", "15177", "14146", "10430", "17329", "17653", "04661", "02875", "06624", "21302", "20842", "20991", "11602", "10067", "10716", "10079", "04790", "14282", "11304", "20460", "17482", "11306", "16677", "20996", "21302", "70061", "10289", "27480", "25698", "16536", "14355", "20120", "13539", "11907", "20913", "19588", "06929", "15154", "08395", "05075", "17708", "05130", "02875", "12815", "11608", "21567", "17092", "16990", "16728", "10450", "00410", "07406", "21010", "16728", "20321", "07830", "17993", "70060", "20714", "21571", "70034", "17134", "15177", "21209", "14355", "11068", "90452", "70060", "06159", "20991", "91270", "12006", "03690", "17329", "06245", "17923", "04458", "16684", "07863", "11898", "21629", "12980", "17891", "70161", "12048", "17470", "17244", "15223", "06843", "02627", "04569", "27767", "11895", "21404", "10079", "20468", "11972", "12913", "73083", "12230", "11708", "13860", "17867", "04429", "07878", "06842", "11390", "28526", "11241", "20144", "15602", "08299", "04986", "02539", "13479", "03600", "21188", "20757", "04429", "14168", "14322", "17670", "06245", "26868", "02945", "21001", "17861", "17313", "17984", "16817", "13026", "91838", "70123", "06432", "70060", "00459", "11241", "18871", "21340", "14436", "11608", "20977", "03748", "02432", "90797", "14565", "14436", "06929", "03622", "05076", "08395", "15011", "11608", "00459", "08395", "10060", "07896", "20197", "13580", "17018", "28618", "03390", "14287", "11188", "16705", "13223", "11708", "20530", "04467", "13594", "02157", "02539", "17788", "10513", "19932", "12424", "01656", "17925", "04632", "04700", "20932", "10657", "13026", "27060", "11178", "00459", "05475", "13820", "15737", "27061", "08330", "28618", "91628", "05076", "13594", "04532", "27761", "12838", "00459", "20419", "28705", "09781", "11858", "11907", "20649", "91837", "12652", "21159", "16435", "15602", "08399", "14764", "17788", "90433", "11412", "05254", "06621", "20055", "21052", "00459", "13026", "20189", "04327", "20570", "05076", "14373", "17809", "16435", "15177", "20645", "14953", "20055", "12953"];
let indiceCodigoCliente = 0;




const LINEAS = [
	{
		"codigoArticulo": "001859",
		"cantidad": 3
	},
	{
		"codigoArticulo": "004882",
		"cantidad": 1
	},
	{
		"codigoArticulo": "007073",
		"cantidad": 2
	},
	{
		"codigoArticulo": "033499",
		"cantidad": 1
	},
	{
		"codigoArticulo": "146316",
		"cantidad": 1
	},
	{
		"codigoArticulo": "152729",
		"cantidad": 1
	},
	{
		"codigoArticulo": "152925",
		"cantidad": 24
	},
	{
		"codigoArticulo": "152927",
		"cantidad": 3
	},
	{
		"codigoArticulo": "152928",
		"cantidad": 4
	},
	{
		"codigoArticulo": "152929",
		"cantidad": 4
	},
	{
		"codigoArticulo": "152931",
		"cantidad": 1
	},
	{
		"codigoArticulo": "154845",
		"cantidad": 2
	},
	{
		"codigoArticulo": "157169",
		"cantidad": 1
	},
	{
		"codigoArticulo": "157170",
		"cantidad": 1
	},
	{
		"codigoArticulo": "158267",
		"cantidad": 5
	},
	{
		"codigoArticulo": "158316",
		"cantidad": 1
	},
	{
		"codigoArticulo": "158317",
		"cantidad": 2
	},
	{
		"codigoArticulo": "165136",
		"cantidad": 3
	},
	{
		"codigoArticulo": "165137",
		"cantidad": 3
	},
	{
		"codigoArticulo": "165138",
		"cantidad": 1
	},
	{
		"codigoArticulo": "165949",
		"cantidad": 1
	},
	{
		"codigoArticulo": "172537",
		"cantidad": 1
	},
	{
		"codigoArticulo": "173044",
		"cantidad": 1
	},
	{
		"codigoArticulo": "173321",
		"cantidad": 2
	},
	{
		"codigoArticulo": "174075",
		"cantidad": 2
	},
	{
		"codigoArticulo": "177511",
		"cantidad": 1
	},
	{
		"codigoArticulo": "178996",
		"cantidad": 1
	},
	{
		"codigoArticulo": "179064",
		"cantidad": 3
	},
	{
		"codigoArticulo": "192415",
		"cantidad": 1
	},
	{
		"codigoArticulo": "195449",
		"cantidad": 1
	},
	{
		"codigoArticulo": "299883",
		"cantidad": 1
	},
	{
		"codigoArticulo": "323118",
		"cantidad": 1
	},
	{
		"codigoArticulo": "417865",
		"cantidad": 1
	},
	{
		"codigoArticulo": "469809",
		"cantidad": 1
	},
	{
		"codigoArticulo": "471672",
		"cantidad": 1
	},
	{
		"codigoArticulo": "482299",
		"cantidad": 1
	},
	{
		"codigoArticulo": "482315",
		"cantidad": 1
	},
	{
		"codigoArticulo": "659065",
		"cantidad": 1
	},
	{
		"codigoArticulo": "659281",
		"cantidad": 1
	},
	{
		"codigoArticulo": "659714",
		"cantidad": 1
	},
	{
		"codigoArticulo": "661753",
		"cantidad": 1
	},
	{
		"codigoArticulo": "662039",
		"cantidad": 1
	},
	{
		"codigoArticulo": "662082",
		"cantidad": 1
	},
	{
		"codigoArticulo": "664398",
		"cantidad": 1
	},
	{
		"codigoArticulo": "664928",
		"cantidad": 1
	},
	{
		"codigoArticulo": "669515",
		"cantidad": 1
	},
	{
		"codigoArticulo": "671995",
		"cantidad": 1
	},
	{
		"codigoArticulo": "673244",
		"cantidad": 1
	},
	{
		"codigoArticulo": "677709",
		"cantidad": 1
	},
	{
		"codigoArticulo": "682120",
		"cantidad": 1
	},
	{
		"codigoArticulo": "685628",
		"cantidad": 1
	},
	{
		"codigoArticulo": "689786",
		"cantidad": 1
	},
	{
		"codigoArticulo": "699264",
		"cantidad": 1
	},
	{
		"codigoArticulo": "700538",
		"cantidad": 1
	},
	{
		"codigoArticulo": "700668",
		"cantidad": 1
	},
	{
		"codigoArticulo": "701912",
		"cantidad": 1
	},
	{
		"codigoArticulo": "701917",
		"cantidad": 1
	},
	{
		"codigoArticulo": "702683",
		"cantidad": 1
	},
	{
		"codigoArticulo": "703194",
		"cantidad": 1
	},
	{
		"codigoArticulo": "704557",
		"cantidad": 1
	},
	{
		"codigoArticulo": "705046",
		"cantidad": 1
	},
	{
		"codigoArticulo": "709155",
		"cantidad": 1
	},
	{
		"codigoArticulo": "712874",
		"cantidad": 5
	},
	{
		"codigoArticulo": "721605",
		"cantidad": 3
	},
	{
		"codigoArticulo": "723098",
		"cantidad": 1
	},
	{
		"codigoArticulo": "723944",
		"cantidad": 1
	},
	{
		"codigoArticulo": "725028",
		"cantidad": 1
	},
	{
		"codigoArticulo": "729566",
		"cantidad": 1
	},
	{
		"codigoArticulo": "731679",
		"cantidad": 1
	},
	{
		"codigoArticulo": "745281",
		"cantidad": 1
	},
	{
		"codigoArticulo": "758151",
		"cantidad": 1
	},
	{
		"codigoArticulo": "790527",
		"cantidad": 1
	},
	{
		"codigoArticulo": "822494",
		"cantidad": 1
	},
	{
		"codigoArticulo": "840488",
		"cantidad": 2
	},
	{
		"codigoArticulo": "853218",
		"cantidad": 1
	},
	{
		"codigoArticulo": "866947",
		"cantidad": 2
	},
	{
		"codigoArticulo": "882209",
		"cantidad": 1
	},
	{
		"codigoArticulo": "887976",
		"cantidad": 1
	},
	{
		"codigoArticulo": "911693",
		"cantidad": 1
	},
	{
		"codigoArticulo": "915884",
		"cantidad": 1
	},
	{
		"codigoArticulo": "916007",
		"cantidad": 1
	},
	{
		"codigoArticulo": "961763",
		"cantidad": 1
	},
	{
		"codigoArticulo": "977298",
		"cantidad": 1
	},
	{
		"codigoArticulo": "998625",
		"cantidad": 1
	}
];



const _generarNumeroLineasAleatorio = () => {
	let randomLineas = Math.random()

	if (randomLineas >= 0.67) {
		// 9 líneas o mas -> con igual probabilidad
		return Math.floor((LINEAS.length - 9) * Math.random()) + 9;
	} else if (randomLineas >= 0.65) {
		return 8;
	} else if (randomLineas >= 0.64) {
		return 7;
	} else if (randomLineas >= 0.62) {
		return 6;
	} else if (randomLineas >= 0.59) {
		return 5;
	} else if (randomLineas >= 0.56) {
		return 4;
	} else if (randomLineas >= 0.51) {
		return 3;
	} else if (randomLineas >= 0.44) {
		return 2;
	} else {
		return 1;
	}
}

const _generarTipoPedidoAleatorio = () => {
	let randomTipo = Math.random()

	if (randomTipo < 0.818) {
		return 0;
	} else if (randomTipo < 0.878) {
		return 28;
	} else if (randomTipo < 0.936) {
		return 99;
	} else if (randomTipo < 0.96) {
		return 60;
	} else if (randomTipo < 0.969) {
		return 303;
	} else if (randomTipo < 0.975) {
		return 40; // TRANSFER !
	} else if (randomTipo < 0.98) {
		return 59;
	} else if (randomTipo < 0.985) {
		return 24;
	} else if (randomTipo < 0.987) {
		return 53;
	} else if (randomTipo < 0.988) {
		return 13;
	} else if (randomTipo < 0.99) {
		return 33;
	} else {
		return 0;
	}


}

const _generarCodigoCliente = () => {
	indiceCodigoCliente = (indiceCodigoCliente + 1) % CODIGOS_CLIENTE.length;
	return CODIGOS_CLIENTE[indiceCodigoCliente];
}

const _generarTramaPedido = () => {

	let trama = {
		codigoCliente: _generarCodigoCliente(),
		numeroPedidoOrigen: 'CARGA' + Math.ceil(Math.random() * 100000) + '' + Math.ceil(Math.random() * 100000),
		authReq: {
			username: CODIGO_AUTENTICACION,
			domain: 'FEDICOM'
		}
	}

	let tipoPedido = _generarTipoPedidoAleatorio();
	if (tipoPedido) trama.tipoPedido = tipoPedido;

	trama.lineas = LINEAS.slice(0, _generarNumeroLineasAleatorio());


	console.log('Generado pedido', 'Lineas: ', trama.lineas.length, ', Tipo: ', tipoPedido, 'Cliente: ', trama.codigoCliente, ' CodigoPedidoOrigen: ', trama.numeroPedidoOrigen);
	return trama;

}


const _sumaResultados = (resultadoActual, nuevoTiempo, respuestaHttp, pedidoEnviado) => {
	let clonResultadoActual = clone(resultadoActual);
	if (respuestaHttp?.ok && respuestaHttp?.body?.numeroPedido) clonResultadoActual.ok++;
	else clonResultadoActual.fallos++;

	clonResultadoActual.tiempoTotal += nuevoTiempo;
	clonResultadoActual.mediaTiempos = clonResultadoActual.tiempoTotal / (clonResultadoActual.fallos + clonResultadoActual.ok);

	let hora = new Date();
	hora = hora.getHours() + ':' + hora.getMinutes() + ':' + hora.getSeconds();

	if (respuestaHttp?.body?.numeroPedido) {
		clonResultadoActual.ultimasOperaciones.push({
			hora: hora,
			tiempo: nuevoTiempo,
			crc: respuestaHttp.body.numeroPedido.substring(0, 8).toUpperCase(),
			numeroPedidoOrigen: respuestaHttp.body.numeroPedidoOrigen,
			numeroLineas: respuestaHttp.body.lineas.length,
			tipoPedido: respuestaHttp.body.tipoPedido ?? 0,
			cliente: respuestaHttp.body.codigoCliente
		});

		if (clonResultadoActual.ultimasOperaciones.length > 10)
			clonResultadoActual.ultimasOperaciones = clonResultadoActual.ultimasOperaciones.slice(1);

	} else {
		clonResultadoActual.errores.push({
			hora: hora,
			tiempo: nuevoTiempo,
			mensaje: respuestaHttp?.body[0]?.descripcion ?? respuestaHttp?.message,
			variante: respuestaHttp?.body[0]?.descripcion ? 'primary' : 'danger',
			numeroPedidoOrigen: pedidoEnviado?.numeroPedidoOrigen,
			numeroLineas: pedidoEnviado?.lineas?.length,
			tipoPedido: pedidoEnviado?.tipoPedido ?? 0,
			cliente: pedidoEnviado?.codigoCliente
		});

		if (clonResultadoActual.ultimasOperaciones.length > 50)
			clonResultadoActual.ultimasOperaciones = clonResultadoActual.ultimasOperaciones.slice(1);
	}

	return clonResultadoActual;
}


const PruebaCarga = ({ jwt }) => {

	const [resultado, setResultado] = useState({ fallos: 0, ok: 0, tiempoTotal: 0, mediaTiempos: 0, ultimasOperaciones: [], errores: [] })
	const [arrancado, setArrancado] = useState(false);

	const lanzarCohete = useCallback(() => {

		let pedido = _generarTramaPedido()

		let tiempoInicio = (new Date()).getTime();
		fedicomFetch(K.DESTINOS.CORE + '/pedidos', { method: 'POST' }, jwt, pedido)
			.then(response => {
				let tiempoTranscurrido = (new Date()).getTime() - tiempoInicio;
				setResultado(_sumaResultados(resultado, tiempoTranscurrido, response, pedido))
			})
			.catch(error => {
				let tiempoTranscurrido = (new Date()).getTime() - tiempoInicio;
				setResultado(_sumaResultados(resultado, tiempoTranscurrido, error, pedido))
			})
	}, [resultado, jwt])


	useEffect(() => {
		if (arrancado) lanzarCohete();
	}, [resultado, arrancado, lanzarCohete])


	const arranqueParada = () => {
		setArrancado(!arrancado);
	}




	let boton = null;

	if (arrancado) {
		boton = <Button size='lg' variant='danger' onClick={arranqueParada}> ECHA EL FRENO </Button>
	} else {
		boton = <Button size='lg' variant='success' onClick={arranqueParada}> ARRANCA LA MOTO </Button>
	}


	return <Container>
		<h4 className="border-bottom pb-2">
			Prueba de carga
		</h4>


		<Container>

			<Row>
				<Col sm='12'>
					<Card variant='primary'>
						<Card.Body >
							<Card.Title>{resultado.ok + resultado.fallos} pedidos enviados</Card.Title>
							<Card.Title>{resultado.fallos} pedidos que fallaron</Card.Title>
							<Card.Title>{Math.round(resultado.mediaTiempos * 100) / 100} milisegundos por pedido de media</Card.Title>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{resultado.ultimasOperaciones.length > 0 &&
				<>
					<h4 className="mt-2">Últimos resultados</h4>

						<Table size="sm" striped bordered>
						<thead>
							<tr>
								<td>Hora</td>
								<td>Tiempo</td>
								<td>CRC</td>
								<td>Numero Pedido Origen</td>
								<td>Lineas</td>
								<td>Tipo Pedido</td>
								<td>Cliente</td>
							</tr>
						</thead>
						<tbody>

							{resultado.ultimasOperaciones.map((op, i) => {
								return (<tr key={i}>
									<td>{op.hora}</td>
									<td>{op.tiempo} ms</td>
									<td>{op.crc}</td>
									<td>{op.numeroPedidoOrigen}</td>
									<td>{op.numeroLineas}</td>
									<td>{op.tipoPedido}</td>
									<td>{op.cliente}</td>
								</tr>)
							})}

						</tbody>
					</Table>
				</>
			}
			{resultado.errores.length > 0 &&
				<>
					<h4 className="mt-2">Errores que han salido</h4>
					{clone(resultado.errores).reverse().map((err, i) => {
						return (<Alert key={i} variant={err.variante}>
							{err.hora}: <b>{err.numeroPedidoOrigen}</b> - {err.mensaje}
						</Alert>)
					})}
				</>
			}

			<Row>
				<Col className="p-2 mt-3 text-center">
					{boton}
				</Col>
			</Row>

		</Container>





	</Container>

}


export default PruebaCarga