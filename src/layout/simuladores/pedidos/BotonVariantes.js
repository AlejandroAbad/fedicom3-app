import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { MdLayers } from 'react-icons/md'
import Icono from 'componentes/icono/Icono'



const VARIANTES = {

	normalica: {
		auth: { usuario: "10100117", dominio: "FEDICOM" },
		codigoCliente: "117",
		tipoPedido: "",
		almacen: "",
		fechaServicio: null,
		direccionEnvio: "",
		observaciones: "",
		lineas: [
			{ codigoArticulo: "150000", cantidad: "3" },
			{ codigoArticulo: "167352", cantidad: "1" },
			{ codigoArticulo: "399394", cantidad: "2" },
			{ codigoArticulo: "170744", cantidad: "1" }
		]
	},
	estupe: {
		auth: { usuario: "10107506", dominio: "FEDICOM" },
		codigoCliente: "7506",
		tipoPedido: "",
		almacen: "",
		fechaServicio: null,
		direccionEnvio: "",
		observaciones: "",
		lineas: [
			{ codigoArticulo: "8470009998738", cantidad: 1, valeEstupefaciente: "9999142001752" }
		]
	},
	transferCinfa: {
		auth: { codigoLaboratorio: "60200118", tipoTransfer: "TR", dominio: "transfer_laboratorio" },
		codigoCliente: "9293",
		tipoPedido: "023",
		almacen: "",
		fechaServicio: null,
		direccionEnvio: "",
		observaciones: "",
		lineas: [
			{ codigoArticulo: "492983", cantidad: 2, cantidadBonificacion: 1, descuentoPorcentaje: 20 }
		]
	},
	fmasonline1: {
		auth: { usuario: "F+Online", dominio: "FMAS" },
		codigoCliente: "0010104718",
		tipoPedido: "000067",
		almacen: "",
		fechaServicio: null,
		direccionEnvio: "",
		observaciones: "",
		lineas: [
			{ codigoArticulo: "264662", cantidad: "1" }
		]
	},
	forzarAlmacen: {
		auth: { usuario: "10100117", dominio: "FEDICOM" },
		codigoCliente: "117",
		tipoPedido: "",
		almacen: "RG01",
		fechaServicio: null,
		direccionEnvio: "",
		observaciones: "Servir por Santomera",
		lineas: [
			{ codigoArticulo: "150000", cantidad: "3" },
			{ codigoArticulo: "170744", cantidad: "1" }
		]
	},
	empleado: {
		auth: { usuario: "empleado", dominio: "empleado" },
		codigoCliente: "0019901402",
		tipoPedido: "",
		almacen: "",
		fechaServicio: null,
		direccionEnvio: "",
		observaciones: "",
		lineas: [
			{ codigoArticulo: "187270", cantidad: "3" },
			{ codigoArticulo: "182272", cantidad: "1" }
		]
	}
}



const BotonVariantes = ({ establecerVariante }) => {
	return (
		<Dropdown className="float-right" alignRight>
			<Dropdown.Toggle variant="outline-primary" id="dropdown-variantes" size="sm">
				<Icono icono={MdLayers} posicion={[20,2]} className="mr-1" />Variantes
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.normalica)}>Pedido normalico</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.estupe)}>Pedido con estupe</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.fmasonline1)}>Pedido F+Online</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.transferCinfa)}>Transfer CINFA</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.forzarAlmacen)}>Forzar almacén</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.empleado)}>Pedido empleado</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}


export default BotonVariantes