import K from 'K'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import fedicomFetch from 'util/fedicomFetch'
import { Container, Alert, Button, Spinner, Accordion, Card, Row, Col, Badge } from 'react-bootstrap'
import moment from 'moment'
import useInterval from 'util/useInterval'
import { GoSync } from 'react-icons/go'
import Icono from 'componentes/icono/Icono'
import { MdSubdirectoryArrowRight } from 'react-icons/md'

require('moment/locale/es')

const EstadoProcesos = ({ jwt, ...props }) => {


	const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false })


	// Para no perder el ultimo resultado entre cargas de mas resultados
	const ultimoResultado = useRef(resultado);

	if (resultado !== ultimoResultado.current) ultimoResultado.current = resultado;


	const ejecutarConsulta = useCallback(() => {
		setResultado({ datos: ultimoResultado.current.datos, error: ultimoResultado.current.error, cargando: true });

		fedicomFetch(K.DESTINOS.MONITOR + '/status/proc', { method: 'GET' }, jwt)
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

	useEffect(() => {
		ejecutarConsulta()
	}, [ejecutarConsulta])

	useInterval(ejecutarConsulta, 1000)


	let procesos = resultado?.datos?.data;

	let hosts = {}

	if (procesos && procesos.length > 0) {
		procesos.forEach(proc => {
			if (!hosts[proc.host]) hosts[proc.host] = new ProcHost(proc.host)
			hosts[proc.host].addProc(proc)
		})
	}

	return <>
		<Container>
			<EstadoConsulta resultado={resultado} onRetry={ejecutarConsulta} />
			{
				Object.values(hosts).map((host, i) => <ProcHostElement key={i} procHost={host} />)
			}
		</Container>
	</>

}

const ProcHostElement = ({ procHost }) => {
	if (!procHost) return null;

	return (
		<Container className="mb-4">
			<Accordion defaultActiveKey="0">
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey="0" className={`bg-${procHost.getStatusColor()}-soft`}>
						<span className="h4">{procHost.hostname.toUpperCase()}</span>
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="0">
						<Container fluid className="px-0 my-3">
							<ProcElement proc={procHost.masterProc} />
							{procHost.workerProcs.map((worker, i) => <ProcElement key={i} proc={worker} />)}
							<ProcElement proc={procHost.watchdogProc} />
							<ProcElement proc={procHost.monitorProc} />
						</Container>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		</Container>
	)

}

const ProcElement = ({ proc }) => {
	if (!proc) return null;

	let rowClassName = "text-monospace no-gutters mx-3 py-0"
	let showInitDiff = true

	if (!proc.isWorker()) {
		rowClassName += ' mt-1 '
	}

	let hb = <Badge variant="success">OK</Badge>
	if (proc.isDead()) {
		rowClassName += ' bg-danger-soft'
		hb = <><Badge variant="danger">MUERTO</Badge><small className="ml-1"><span className="d-none d-md-inline">Hace </span>{proc.getHbTime().humanize()}</small></>
		showInitDiff = false
	}

	return (
		<Row className={rowClassName}>
			<Col lg={2} md={2} sm={3} xs={3} className={proc.isWorker() ? 'pl-sm-3' : ''}>
				{proc.getName()}
			</Col>
			<Col lg={3} md={4} sm={4} xs={4} className><strong className="d-none d-sm-inline">PID: </strong>{proc.pid}{proc.workerId && <small> <strong className="d-none d-md-inline">Worker </strong>#{proc.workerId}</small>}</Col>
			<Col lg={3} md={6} sm={5} xs={5}>{hb} {showInitDiff && <small><strong className="d-none d-md-inline">UpTime:</strong> {proc.getUptime().humanize()}</small>}</Col>
			<Col lg={4} className="d-none d-lg-block">
				{proc.extra()}
			</Col>
		</Row>
	)
}

class Proc {
	constructor(proc) {
		Object.assign(this, proc)
	}

	getName() {
		switch (this.type) {
			case "core-master": return <Badge variant='primary' className="px-2 py-1">MASTER</Badge>
			case "core-worker": return <><Icono icono={MdSubdirectoryArrowRight} /><Badge variant='success' className="px-2 py-1">WORKER</Badge></>
			case "watchdog": return <Badge variant='warning' className="px-2 py-1">WATCH DOG</Badge>
			case "monitor": return <Badge variant='info' className="px-2 py-1">MONITOR</Badge>
			default: return <Badge variant='danger' className="px-2 py-1">?????</Badge>
		}
	}

	isWorker() {
		return this.workerId ? true : false
	}

	getUptime() {
		return moment.duration(moment().diff(moment(this.init, 'x')))
	}

	getHbTime() {
		return moment.duration(moment().diff(moment(this.timestamp, 'x')))
	}

	isDead() {
		return (this.getHbTime().asSeconds() > 15)
	}

	extra() {
		if (this.type === 'watchdog') {
			let badge = null;
			switch (this.maestro) {
				case 3:
					badge = <Badge variant="success">PRIMARIO</Badge>
					break;
				case 0:
					badge = <Badge variant="secondary">SECUNDARIO</Badge>
					break;
				default:
					badge = <Badge variant="primary">ADQUIRIENDO {this.maestro}/3</Badge>
					break;
			}
			return <>{badge}<small className="ml-2"><strong>Prioridad: </strong>{this.priority}</small></>
		}
		return null;
	}
}

class ProcHost {
	constructor(hostname) {
		this.hostname = hostname
		this.masterProc = null
		this.watchdogProc = null
		this.monitorProc = null
		this.workerProcs = []
	}

	addProc(proc) {
		if (!proc) return
		let proceso = new Proc(proc)
		switch (proceso.type) {
			case "core-master":
				this.masterProc = proceso;
				break;
			case "core-worker":
				this.workerProcs.push(proceso);
				break;

			case "watchdog":
				this.watchdogProc = proceso;
				break;

			case "monitor":
				this.monitorProc = proceso;
				break;
			default:
				break;
		}
	}

	getStatusColor() {
		let mD = (!this.masterProc || this.masterProc.isDead())
		if (mD) return 'danger'

		let wD = (this.watchdogProc && this.watchdogProc.isDead())
		if (wD) return 'warning'

		this.workerProcs.forEach(wP => {
			if (!wP || wP.isDead()) {
				return 'warning'
			}
		})

		return 'success'

	}

}




const EstadoConsulta = ({ resultado, onRetry }) => {

	const { datos, error, cargando } = resultado;

	if (!error || error.length === 0) {
		if (datos?.data?.length > 0) {
			return null
		}

		if (cargando) {
			return (
				<Alert variant='primary' className="text-center mt-3">
					<Spinner animation="border" variant="primary" className="mt-2" />
					<h5 className="pt-2">Cargando datos ...</h5>
				</Alert>
			)
		}
		return (
			<Alert variant='warning' className="mt-3">
				<Button variant='dark' onClick={onRetry} className="float-right" size="sm">
					<GoSync size={18} style={{ paddingBottom: '3px' }} /> Reintentar
                    </Button>
				<Alert.Heading className="mt-1">No se encontraron procesos</Alert.Heading>
			</Alert>
		)
	}

	let alertas = [];
	if (error.forEach) {
		error.forEach((err, index) => {
			if (err.codigo && err.descripcion) {
				alertas.push(<li key={index}>{err.descripcion} <small className="text-muted">{err.codigo}</small></li>);
			} else {
				alertas.push(<li key={index}>No se pudo alcanzar el servidor</li>);
			}
		})
	} else {
		alertas.push(<li key={0}>No se pudo alcanzar el servidor</li>);
	}

	return (
		<Alert variant='danger'>
			<Button variant='dark' onClick={onRetry} className="float-right" size="sm">
				<Icono icono={GoSync} posicion={[18, 3]} /> Reintentar
            </Button>

			<Alert.Heading>Error al obtener datos</Alert.Heading>
			<ul>
				{alertas}
			</ul>

		</Alert>
	)
}



export default EstadoProcesos