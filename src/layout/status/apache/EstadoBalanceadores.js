import K from 'K'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Alert} from 'react-bootstrap'
import { FaBalanceScale } from 'react-icons/fa';
import { TiArrowShuffle, TiArrowDown } from 'react-icons/ti';
import Icono from 'componentes/icono/Icono';
import fedicomFetch from 'util/fedicomFetch';


const EstadoBalanceadores = ({ jwt, ...props }) => {

	let slbCore = new URL(K.DESTINOS.CORE).hostname.split('.')[0]

	const [slbEntrada/*, setSlbEntrada*/] = useState({ cargando: false, balanceadores:[slbCore], error: null})
	const [slbSalida, setSlbSalida] = useState({ cargando: true, balanceadores: [], error: null })


	useEffect( () => {
		fedicomFetch(K.DESTINOS.MONITOR + '/status/proc', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {

						let procesos = response?.body?.data;
						let balanceadores = []
						if (procesos && procesos.length > 0) {
							procesos.forEach(proc => {
								if (proc.type === 'core-master') {
									balanceadores.push(proc.host)
								}
							})
						}
						setSlbSalida({ balanceadores: balanceadores, error: null, cargando: false });
					} else {
						setSlbSalida({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setSlbSalida({ datos: null, error, cargando: false });
			})
	}, [setSlbSalida, jwt])

	return <Container>

		<Row className="mt-2 d-flex align-items-center justify-content-center">
			<Col sm={6} lg={4} className="text-center border-bottom pb-2">
				<h4 className="m-0">Entrada</h4>
				<span className="m-0 text-muted"><small>Entrada desde el exterior al concentrador</small></span>
			</Col>

			<Col sm={1} ></Col>

			<Col sm={5} lg={4} className="text-center border-bottom pb-2 d-none d-sm-inline-block">
				<h4 className="m-0">Envío a SAP</h4>
				<span className="m-0 text-muted"><small>Salida del concentrador hacia SAP</small></span>
			</Col>
		</Row>

		<Row className="mt-2 d-flex align-items-center justify-content-center">
			<Col sm={6} lg={4}>
				{ (slbEntrada.balanceadores.length > 0) && 
					slbEntrada.balanceadores.map((bal, i) => <ServidorApache key={i} nombre={bal} />)
				}
			</Col>

			<Col sm={1} className="d-none d-sm-inline-block"><Icono icono={TiArrowShuffle} posicion={[60,16]} /></Col>
			<Col xs={12} className="text-center d-sm-none border-bottom pb-2 mb-2">
				<Icono icono={TiArrowDown} posicion={[60, 16]} />
				<h4 className="m-0">Envío a SAP</h4>
				<span className="m-0 text-muted"><small>Salida del concentrador hacia SAP</small></span>
			</Col>

			<Col sm={5} lg={4}>
				{(slbSalida.balanceadores.length > 0) &&
					slbSalida.balanceadores.map((bal, i) => <ServidorApache key={i} nombre={bal} />)
				}
			</Col>
		</Row>

	</Container>

}


const ServidorApache = ( {nombre, variant} ) => {
	return <Col xs={12}>
		<Link to={`/estado/balanceador/${nombre}`} className="text-decoration-none">
		<Alert variant={variant ?? 'primary'}>
			<Icono icono={FaBalanceScale} posicion={[22, 4]}/>
			<span className="ml-2 text-uppercase font-weight-bold">{nombre}</span>
		</Alert>
		</Link>
	</Col>
}



export default EstadoBalanceadores