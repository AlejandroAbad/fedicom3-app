import K from 'K'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Container, Row, Col, Alert, Badge, Dropdown, Button } from 'react-bootstrap'
import fedicomFetch from 'util/fedicomFetch';
import useInterval from 'util/useInterval';
import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi';
import { FaExclamation, FaCheck, FaPlay, FaStop, FaCog, FaRegStopCircle } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';
import { MdSnooze, MdAlarmOn } from 'react-icons/md';
import { GiDrop } from 'react-icons/gi';
import { LinkContainer } from 'react-router-bootstrap';
import { TiArrowBack } from 'react-icons/ti';


const EstadoBalanceador = ({ jwt, servidor, ...props }) => {

	servidor = servidor ?? props?.match?.params?.servidor ?? (new URL(K.DESTINOS.CORE).hostname.split('.')[0])

	// Los servidores f3* son los balanceadores interos de SAP que no 
	// utilizan HTTPS


	const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false })


	// Para no perder el ultimo resultado entre cargas de mas resultados
	const ultimoResultado = useRef(resultado);
	if (resultado !== ultimoResultado.current) ultimoResultado.current = resultado;


	const ejecutarConsulta = useCallback(() => {
		setResultado({ datos: ultimoResultado.current.datos, error: ultimoResultado.current.error, cargando: true });

		let https = 'https=si'
		if (servidor.startsWith('f3')) {
			https = 'https=no'
		}

		fedicomFetch(K.DESTINOS.MONITOR + '/status/apache/balanceadores?' + https + '&servidor=' + servidor, { method: 'GET' }, jwt)
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
	}, [setResultado, servidor, jwt])

	useEffect(() => {
		ejecutarConsulta()
	}, [ejecutarConsulta])

	useInterval(ejecutarConsulta, 5000)


	const actualizarWorker = useCallback((balanceador, worker, nonce, estado, peso) => {
		setResultado({ datos: ultimoResultado.current.datos, error: ultimoResultado.current.error, cargando: true });

		let https = 'https=si'
		if (servidor.startsWith('f3')) {
			https = 'https=no'
		}

		let peticion = {
			balanceador,
			worker,
			nonce,
			estado,
			peso
		}

		fedicomFetch(K.DESTINOS.MONITOR + '/status/apache/balanceadores?' + https + '&servidor=' + servidor, { method: 'PUT' }, jwt, peticion)
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
	}, [setResultado, servidor, jwt])



	const workerStart = (balanceador, worker, nonce, flag) => {
		actualizarWorker(balanceador, worker, nonce, { stop: !flag })
	}


	const workerStandBy = (balanceador, worker, nonce, flag) => {
		actualizarWorker(balanceador, worker, nonce, { standby: flag })
	}


	if (!resultado?.datos?.data) {
		return <Container>
			<DepuradorAPI query={{ server: new URL(K.DESTINOS.CORE).hostname }} id="estadoBalanceo" resultado={resultado} />
		</Container>
	}

	let protocol = 'https'
	if (servidor.startsWith('f3')) {
		protocol = 'http'
	}

	return <Container>
		<h3 className="text-uppercase mb-0">{servidor}
			<LinkContainer to="/estado/balanceadores" className="float-right">
				<Button size="sm" variant="outline-dark" className="pt-2 pb-1" >
					<Icono icono={TiArrowBack} posicion={[28, 4]} />
					Volver
				</Button>
			</LinkContainer>
		</h3>

		<span className="text-muted text-monospace">Estado del balanceador de carga en <span className="text-primary">{protocol}://{servidor}.hefame.es</span></span>
		<hr />
		{Object.values(resultado?.datos?.data).map((b, i) => <Balanceador key={i} balanceador={b} jwt={jwt} onWorkerStart={workerStart} onWorkerStandBy={workerStandBy} />)}

	</Container>


}

const Balanceador = ({ jwt, balanceador, onWorkerStart, onWorkerStandBy }) => {
	const workerStart = (worker, flag) => {
		onWorkerStart(balanceador.nombre, worker, balanceador.nonce, flag)
	}


	const workerStandBy = (worker, flag) => {
		onWorkerStandBy(balanceador.nombre, worker, balanceador.nonce, flag)
	}


	return <Row className="pb-2 mb-4 border-bottom">
		<Col sm={3} >
			<span className="text-monospace">Grupo de balanceo:</span>
			<h6 className="text-monospace font-weight-bold">{balanceador.nombre}</h6>
		</Col>

		<Col sm={9} className="border-left">
			{balanceador.workers.map((w, i) => <Worker key={i} worker={w} jwt={jwt} onStart={workerStart} onStandBy={workerStandBy} />)}
		</Col>
	</Row>
}

const WORKER_FLAGS = {
	ignoraErrores: { variant: 'warning', icono: FaExclamation, texto: 'Ignorando errores' },
	drenando: { variant: 'warning', icono: GiDrop, texto: 'Drenando' },
	deshabilitado: { variant: 'dark', icono: FaRegStopCircle, texto: 'Deshabilitado' },
	parado: { variant: 'dark', icono: FaRegStopCircle, texto: 'Parado' },
	standby: { variant: 'primary', icono: MdSnooze, texto: 'StandBy' },
	ok: { variant: 'success', icono: FaCheck, texto: 'OK' },
	error: { variant: 'danger', icono: FaExclamation, texto: 'Error' }
}

const Worker = ({ jwt, worker, onStart, onStandBy }) => {

	let flags = []
	let i = 0;
	for (let f in worker.estado) {
		if (worker.estado[f] && f !== 'ok') {
			let flagData = WORKER_FLAGS[f]
			flags.push(<Badge pill key={i++} variant={flagData.variant} className="pt-1 pb-0 px-2 mr-1">
				<Icono icono={flagData.icono} posicion={[20, 3]} />
				<span className="ml-1">{flagData.texto}</span>
			</Badge>)
		}
	}

	let variant = "success"

	if (worker.estado.standby) {
		variant = "primary"
	}

	if (worker.estado.drenando || worker.estado.parado || worker.estado.deshabilitado) {
		variant = "secondary"
	}

	if (worker.estado.error) {
		variant = "danger"
	}

	return <Col>
		<Alert variant={variant} className="text-reset">
			<Col xs={12}>
				<span className="text-monospace font-weight-bold">{worker.nombre}</span>
				{(jwt?.data?.perms?.includes("FED3_BALANCEADOR")) &&
					<Dropdown className="float-right">
						<Dropdown.Toggle variant="light" size="sm">
							<Icono icono={FaCog} posicion={[18, 3]} /> Acciones
  					</Dropdown.Toggle>

						<Dropdown.Menu>
							{worker.estado.parado && <Dropdown.Item href="#" className="text-success" onClick={() => onStart(worker.nombre, true)}><Icono icono={FaPlay} posicion={[18, 3]} /> Activar</Dropdown.Item>}
							{!worker.estado.parado && <Dropdown.Item href="#" className="text-danger" onClick={() => onStart(worker.nombre, false)}><Icono icono={FaStop} posicion={[18, 3]} /> Detener</Dropdown.Item>}
							{worker.estado.standby && <Dropdown.Item href="#" className="text-success" onClick={() => onStandBy(worker.nombre, false)}><Icono icono={MdAlarmOn} posicion={[20, 1]} /> Quitar StandBy</Dropdown.Item>}
							{!worker.estado.standby && <Dropdown.Item href="#" onClick={() => onStandBy(worker.nombre, true)}><Icono icono={MdSnooze} posicion={[20, 1]} /> Poner en StandBy</Dropdown.Item>}
						</Dropdown.Menu>
					</Dropdown>
				}
			</Col>
			<Col xs={12}>
				{flags}&nbsp;
			</Col>
			<Col xs={12}>
				<Alert variant="light" className="mt-2 mb-0 ml-3 py-1 text-reset text-monospace">
					<Row>
						<Col xs={12} md={6}><strong>Elegido:</strong> {worker.vecesElegido} veces</Col>
						<Col xs={12} md={6}><strong>Peso:</strong> {worker.peso}</Col>
						<Col xs={12} md={6}><strong>Enviado:</strong> {worker.enviado}</Col>
						<Col xs={12} md={6}><strong>Recibido:</strong> {worker.recibido}</Col>
					</Row>
				</Alert>
			</Col>
			<Col xs={12} className="mt-2 text-right">


			</Col>
		</Alert>

	</Col>
}



export default EstadoBalanceador