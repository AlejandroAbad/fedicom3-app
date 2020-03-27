import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { MdLayers } from 'react-icons/md'
import Icono from 'componentes/icono/Icono'



const VARIANTES = {
	v1: {
		codigoCliente: "117",
		lineas: [
			{ codigoMotivo: "03", codigoArticulo: "150000", cantidad: 3, numeroAlbaran: "ALB123123123", fechaAlbaran: "10/12/2019" }
		],
		auth: { usuario: "10100117", dominio: "FEDICOM" }
	},
	v2: {
		codigoCliente: "117",
		lineas: [
			{ codigoMotivo: "05", codigoArticulo: "150001", cantidad: 3, numeroAlbaran: "ALB123123123", fechaAlbaran: "10/12/2019" },
			{ codigoMotivo: "05", cantidad: 3, numeroAlbaran: "ALB123123123", fechaAlbaran: "10/12/2019" }
		],
		auth: { usuario: "10100117", dominio: "FEDICOM" }
	},
	v3: {
		codigoCliente: "117",
		lineas: [
			{ codigoMotivo: "05", cantidad: 3, numeroAlbaran: "ALB123123123", fechaAlbaran: "10/12/2019" }
		],
		auth: { usuario: "10100117", dominio: "FEDICOM" }
	},
	v4: {
		codigoCliente: "117",
		lineas: [
			{ codigoMotivo: "01", codigoArticulo: "150000", cantidad: 3, numeroAlbaran: "ALB123123121", fechaAlbaran: "10/12/2019" },
			{ codigoMotivo: "01", codigoArticulo: "150001", cantidad: 3, numeroAlbaran: "ALB123123121", fechaAlbaran: "10/12/2019" },
			{ codigoMotivo: "01", codigoArticulo: "150002", cantidad: 3, numeroAlbaran: "ALB123123123", fechaAlbaran: "10/12/2019" },
			{ codigoMotivo: "01", codigoArticulo: "150003", cantidad: 3, numeroAlbaran: "ALB123123123", fechaAlbaran: "10/12/2019" }
		],
		auth: { usuario: "10100117", dominio: "FEDICOM" }
	},
	v5: {
		codigoCliente: "117",
		lineas: [
			{ codigoMotivo: "01", codigoArticulo: "150003", cantidad: 3, numeroAlbaran: "1", fechaAlbaran: "10/12/2019" },
			{ codigoMotivo: "01", codigoArticulo: "150003", cantidad: 3, numeroAlbaran: "1", fechaAlbaran: "10/12/2019" },
			{ codigoMotivo: "01", codigoArticulo: "150003", cantidad: 3, numeroAlbaran: "2", fechaAlbaran: "11/12/2019" },
			{ codigoMotivo: "01", codigoArticulo: "150003", cantidad: 3, numeroAlbaran: "2", fechaAlbaran: "11/12/2019" }
		],
		auth: { usuario: "10100117", dominio: "FEDICOM" }
	},
	v6: {
		codigoCliente: "10109999",
		lineas: [
			{ codigoMotivo: "03", codigoArticulo: "150000", cantidad: 3, numeroAlbaran: "ALB123123123", fechaAlbaran: "10/12/2019" }
		],
		auth: { usuario: "10100117", dominio: "FEDICOM" }
	}
}



const BotonVariantes = ({ establecerVariante }) => {
	return (
		<Dropdown className="float-right" alignRight>
			<Dropdown.Toggle variant="outline-primary" id="dropdown-variantes" size="sm">
				<Icono icono={MdLayers} posicion={[20, 2]} className="mr-1" />Variantes
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.v1)}>Uno bueno</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.v2)}>Uno bueno, uno malo</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.v3)}>Uno malo</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.v4)}>Devolución 4</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.v5)}>Incidencias repes</Dropdown.Item>
				<Dropdown.Item href="#" onClick={() => establecerVariante(VARIANTES.v6)}>Cliente mal</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}


export default BotonVariantes