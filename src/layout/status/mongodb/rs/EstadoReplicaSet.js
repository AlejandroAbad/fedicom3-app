import K from 'K'
import React, { useState, useEffect } from 'react'
import { Container, ListGroup, Card, Row, Col, Badge } from 'react-bootstrap'
import fedicomFetch from 'util/fedicomFetch'
import moment from 'moment'
import ConsultaCargando from 'componentes/estadoConsulta/ConsultaCargando'
import ConsultaError from 'componentes/estadoConsulta/ConsultaError'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem'
import { FaNetworkWired } from 'react-icons/fa'
import Icono from 'componentes/icono/Icono'


const EstadoReplicaSet = ({ jwt }) => {

	const [resultado, setResultado] = useState({ cargando: true, datos: null, error: null })

	useEffect(() => {
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/mongodb/replicaSet', { method: 'GET' }, jwt)
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
				<ConsultaCargando texto="Cargando ReplicaSet ..." />
			</Container>
		)
	}

	let rs = resultado?.datos;

	if (resultado.error || !rs) {
		return <ConsultaError errores={resultado.error} />
	}

	return (
		<Container>
			<h3 className="mb-0 text-monospace">Clúster <b>{rs.name}</b></h3>
			<span className="text-muted "><Icono icono={FaNetworkWired} posicion={[22,2]} /> Estado de la replicación de la base de datos</span>
			<hr />
			<ListGroup className="list-group-flush">
				<ListGroupItem k="Hora del clúster" v={moment(new Date(rs.time)).format('LLLL:ss')} />
				<ListGroupItem k="Intervalo HeartBeat" v={`${rs.heartbeatInterval}ms`} />
			</ListGroup>
			<div className="mt-2 pt-1 ml-3 pl-1 font-weight-bold">Miembros del clúster</div>
			<Row className="mt-3">
				{rs.members.map((member, i) => <ReplicaSetMember key={i} {...member} />)}
			</Row>

		</Container>
	)


}

const ReplicaSetMember = ({ health, state, host, uptime, version, electionDate, masterInstance, ping, delay }) => {


	let variant = ''
	if (health) {
		switch (state.code) {
			case 1:
				variant = 'success'
				break;
			case 2:
				variant = 'primary'
				break;
			case 0:
				variant = 'secondary'
				break;
			case 10:
				variant = 'dark'
				break;
			case 7:
				variant = 'info'
				break;
			case 9:
			case 4:
			case 5:
				variant = 'warning'
				break;
			case 8:
			case 6:
				variant = 'danger'
				break;
			default:
				variant = 'secondary'
		}
	} else {
		variant = 'danger'
	}

	let nombre = host ? host.split('.')[0] : host

	if (masterInstance) {
		masterInstance = masterInstance.split('.')[0]
	}

	if (electionDate) {
		electionDate = moment.duration(moment(new Date(electionDate)).diff(moment()));
	}

	if (uptime) {
		uptime = moment.duration(uptime, 'seconds');
	}

	return (
		<Col lg={4} md={6} className="mb-2 mb-md-0">
			<Card>
				<Card.Header as="h5" className={`bg-${variant}-soft text-center text-uppercase`}>{nombre}</Card.Header>
				<Card.Body className="p-2">
					<Card.Title className="m-0 text-center" >
						<Badge size="lg" variant={variant}>{state.name}</Badge><br />
					</Card.Title>
					<Card.Text className="m-0 text-center text-muted border-bottom" style={{ lineHeight: 1 , minHeight: '50px'}}>
						{electionDate && <span className="text-dark pt-1 d-block">desde hace {electionDate.humanize()}</span>}
						{masterInstance && <span className="text-dark pt-1 d-block">Replicando desde <b className="text-uppercase">{masterInstance}</b></span>}
						<small>
							<small>
								( {state.desc} )
							</small>
						</small>
					</Card.Text>
				</Card.Body>
				<small>
					<ListGroup className="list-group-flush">
						{uptime != null && <ListGroupItem k="Uptime" v={uptime.humanize()} />}
						<ListGroupItem k="Versión" v={version} />
						{ping != null && <ListGroupItem k="Ping" v={`${ping}ms`} />}
						{delay && <ListGroupItem k="Latencia" v={`${delay}ms`} />}
					</ListGroup>
				</small>
			</Card>
		</Col>
	)
}

export default EstadoReplicaSet