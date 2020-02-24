import K from 'K'
import React, { useState, useEffect } from 'react'
import { Container,  } from 'react-bootstrap'
import fedicomFetch from 'util/fedicomFetch'
import ConsultaCargando from 'componentes/estadoConsulta/ConsultaCargando'
import ConsultaError from 'componentes/estadoConsulta/ConsultaError'
import Icono from 'componentes/icono/Icono'
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import { GoDashboard } from 'react-icons/go'


const OperacionesMdb = ({jwt}) => {

	const [resultado, setResultado] = useState({ cargando: true, datos: null, error: null })

	useEffect(() => {
		fedicomFetch(K.DESTINOS.MONITOR + '/status/mdb/op', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ datos: response.body, error: null, cargando: false });
					} else {
						setResultado({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultado({ datos: null, error, cargando: false });
			})
	}, [setResultado, jwt])

	if (resultado.cargando) {
		return (
			<Container>
				<ConsultaCargando texto="Cargando lista de operaciones ..." />
			</Container>
		)
	}

	let ops = resultado?.datos?.data;

	if (resultado.error || !ops) {
		return <ConsultaError errores={resultado.error} />
	}

	let conexiones = []

	ops.forEach((op) => {
		if (op.connectionId && op.appName) {
			let rowData = {
				id: op.connectionId || '-',
				client: op.appName ? op.appName.split('-')[0] : 'interno',
				app: op.appName ? (op.appName.split('-')[3] ? op.appName.split('-')[3] : 'core' ) : '-',
				instance: op.host ? op.host.split(':')[0] : 'interno',
				active: op.active ? 'Si' : 'No'
			};
			conexiones.push(rowData);
		}
	});


	return (
		<Container fluid className="mt-4">
			<h3 className="mb-0 text-monospace">Operaciones</h3>
			<span className="text-muted "><Icono icono={GoDashboard} posicion={[22, 2]} /> Operaciones de la base de datos</span>
			<hr />
			
			<BootstrapTable data={conexiones} bordered condensed>
				<TableHeaderColumn dataField='id' dataSort isKey>ID</TableHeaderColumn>
				<TableHeaderColumn dataField='client' dataSort>Cliente</TableHeaderColumn>
				<TableHeaderColumn dataField='app' dataSort>Aplicación</TableHeaderColumn>
				<TableHeaderColumn dataField='instance' dataSort>Instancia MDB</TableHeaderColumn>
			</BootstrapTable>

		</Container>
	)


}

export default OperacionesMdb

