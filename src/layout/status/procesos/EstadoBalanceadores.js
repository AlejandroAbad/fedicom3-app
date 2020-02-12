import K from 'K'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Container, Row, Col, Alert, Badge, Button } from 'react-bootstrap'
import fedicomFetch from 'util/fedicomFetch';
import useInterval from 'util/useInterval';
import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi';
import { FaExclamation, FaCheck, FaPlay, FaStop } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';
import { MdSnooze, MdAlarmOn } from 'react-icons/md';


const EstadoBalanceadores = ({ jwt, servidor, ...props }) => {


	const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false })


	// Para no perder el ultimo resultado entre cargas de mas resultados
	const ultimoResultado = useRef(resultado);
	if (resultado !== ultimoResultado.current) ultimoResultado.current = resultado;


	const ejecutarConsulta = useCallback(() => {
		setResultado({ datos: ultimoResultado.current.datos, error: ultimoResultado.current.error, cargando: true });
		

		fedicomFetch(K.DESTINOS.MONITOR + '/status/apache/balanceadores?servidor=' + servidor, { method: 'GET' }, jwt)
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

		let peticion = {
			balanceador,
			worker,
			nonce,
			estado,
			peso
		}

		fedicomFetch(K.DESTINOS.MONITOR + '/status/apache/balanceadores?servidor=' + servidor, { method: 'PUT' }, jwt, peticion)
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

	return <Container>

		{Object.values(resultado?.datos?.data).map((b, i) => <Balanceador key={i} balanceador={b} onWorkerStart={workerStart} onWorkerStandBy={workerStandBy}/>)}

	</Container>

}

const Balanceador = ({ balanceador, onWorkerStart, onWorkerStandBy  }) => {
	const workerStart = (worker, flag) => {
		onWorkerStart(balanceador.nombre, worker, balanceador.nonce, flag)
	}


	const workerStandBy = (worker, flag) => {
		onWorkerStandBy(balanceador.nombre, worker, balanceador.nonce, flag)
	}


	return <Row className="pb-2 mb-5">
		<Col sm={3} >
			<h5>{balanceador.nombre}</h5>

		</Col>
		<Col sm={9}>
			{balanceador.workers.map((w, i) => <Worker key={i} worker={w} onStart={workerStart} onStandBy={workerStandBy} />)}
		</Col>
	</Row>
}

const WORKER_FLAGS = {
	ignoraErrores: { variant: 'warning', icono: FaExclamation, texto: 'Ignorando errores' },
	drenando: { variant: 'warning', icono: FaExclamation, texto: 'Drenando' },
	deshabilitado: { variant: 'dark', icono: FaExclamation, texto: 'Deshabilitado' },
	parado: { variant: 'dark', icono: FaExclamation, texto: 'Parado' },
	standby: { variant: 'primary', icono: MdSnooze, texto: 'StandBy' },
	ok: { variant: 'success', icono: FaCheck, texto: 'OK' },
	error: { variant: 'danger', icono: FaExclamation, texto: 'Error' }
}

const Worker = ({ worker, onStart, onStandBy }) => {

	let flags = []
	let i = 0;
	for (let f in worker.estado) {
		if (worker.estado[f]) {
			let flagData = WORKER_FLAGS[f]
			flags.push(<Badge key={i++} variant={flagData.variant} className="pt-2 pb-1 px-2 mr-1">
				<Icono icono={flagData.icono} posicion={[20, 2]} />
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
			</Col>
			<Col xs={12}>
				{flags}
			</Col>
			<Col xs={12}>
				<Alert variant="light" className="mt-2 mb-0 ml-3 py-1 text-reset text-monospace">
					<Row>
						<Col xs={12} md={6}><strong>Peso:</strong> {worker.peso}</Col>
						<Col xs={12} md={6}><strong>Elegido:</strong> {worker.vecesElegido} veces</Col>
						<Col xs={12} md={6}><strong>Enviado:</strong> {worker.enviado}</Col>
						<Col xs={12} md={6}><strong>Recibido:</strong> {worker.recibido}</Col>
					</Row>
				</Alert>
			</Col>
			<Col xs={12} className="mt-2 text-right">
				{worker.estado.parado && <Button variant="success" size="sm" className="ml-1" onClick={() => onStart(worker.nombre, true)}>
					<Icono icono={FaPlay} posicion={[18, 3]} /> Iniciar
				</Button>}
				{!worker.estado.parado && <Button variant="dark" size="sm" className="ml-1" onClick={() => onStart(worker.nombre, false)}>
					<Icono icono={FaStop} posicion={[18, 3]} /> Detener
				</Button>}

				{worker.estado.standby && <Button variant="primary" size="sm" className="ml-1" onClick={() => onStandBy(worker.nombre, false)}>
					<Icono icono={MdAlarmOn} posicion={[20, 1]} /> Activar
				</Button>}
				{!worker.estado.standby && <Button variant="secondary" size="sm" className="ml-1" onClick={() => onStandBy(worker.nombre, true)}>
					<Icono icono={MdSnooze} posicion={[20, 1]} /> StandBy
				</Button>}

			</Col>
		</Alert>

	</Col>
}



export default EstadoBalanceadores