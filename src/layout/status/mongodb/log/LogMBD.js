import K from 'K'
import React, { useState, useEffect } from 'react'
import { Container, Nav, } from 'react-bootstrap'
import fedicomFetch from 'util/fedicomFetch'
import ConsultaCargando from 'componentes/estadoConsulta/ConsultaCargando'
import ConsultaError from 'componentes/estadoConsulta/ConsultaError'
import Icono from 'componentes/icono/Icono'
import { FaDatabase } from 'react-icons/fa'
import useStateLocalStorage from 'util/useStateLocalStorage'


const LogMBD = ({ jwt }) => {

	const [resultado, setResultado] = useState({ cargando: true, datos: null, error: null })
	const [tipoLog, setTipoLog] = useStateLocalStorage('mdbstatus.logType', 'global', false)

	useEffect(() => {
		setResultado({ cargando: true, datos: null, error: null });
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/mongodb/logs?tipo=' + tipoLog, { method: 'GET' }, jwt)
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
	}, [tipoLog, setResultado, jwt])



	let navegadorTipoLog = (<Container fluid className="border-bottom pb-2 mb-2">
		<Nav className="justify-content-center" variant="pills">
			<Nav.Item><Nav.Link disabled>Tipo de log:</Nav.Link></Nav.Item>
			<Nav.Item><Nav.Link active={tipoLog === 'global'} onClick={() => setTipoLog('global')}>Global</Nav.Link></Nav.Item>
			<Nav.Item><Nav.Link active={tipoLog === 'rs'} onClick={() => setTipoLog('rs')}>ReplicaSet</Nav.Link></Nav.Item>
			<Nav.Item><Nav.Link active={tipoLog === 'startupWarnings'} onClick={() => setTipoLog('startupWarnings')}>Arranque</Nav.Link></Nav.Item>
		</Nav>
	</Container>)


	if (resultado.cargando) {
		return (<>
			{navegadorTipoLog}
			<Container>
				<ConsultaCargando texto="Cargando estado de la base de datos ..." />
			</Container>
		</>
		)
	}

	let logs = resultado?.datos;

	if (resultado.error || !logs) {
		return <>
			{navegadorTipoLog}
			<ConsultaError errores={resultado.error} />
		</>
	}


	return (
		<>
			{navegadorTipoLog}
			<Container fluid className="mt-4">


				<h3 className="mb-0 text-monospace">Logs</h3>
				<span className="text-muted "><Icono icono={FaDatabase} posicion={[22, 2]} /> Logs de mongoDB</span>
				<hr />

				<div className="text-monospace" style={{fontSize: '10px', textOverflow: 'ellipsis'}}>
					{logs.log.map((line, i) => (line.match("I  ACCESS") ? '' : <div key={i} style={{ fontSize: '10px', whiteSpace: 'pre-wrap'}} >{line}</div>)) }
				</div>
			</Container>
		</>
	)


}

export default LogMBD

