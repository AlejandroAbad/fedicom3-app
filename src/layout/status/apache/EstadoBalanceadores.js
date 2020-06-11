import K from 'K'
import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Alert} from 'react-bootstrap'
import { FaBalanceScale } from 'react-icons/fa';
import { TiArrowShuffle, TiArrowDown } from 'react-icons/ti';
import Icono from 'componentes/icono/Icono';
import fedicomFetch from 'util/fedicomFetch';
import EstadoConsulta from 'componentes/estadoConsulta/EstadoConsulta';


const EstadoBalanceadores = ({ jwt, ...props }) => {

	const [resultado, setResultado] = useState({ cargando: true, resultados: [], error: null })


	let cargarDatosBalanceadores = useCallback( () => {
		fedicomFetch(K.DESTINOS.MONITOR + '/v1/balanceadores', { method: 'GET' }, jwt)
			.then(response => {
				if (response) {
					if (response.ok) {

						let balanceadores = response?.body;
						console.log('RESULTADO BALANCEADORES', balanceadores)
						setResultado({ resultados: balanceadores, error: null, cargando: false });
					} else {
						setResultado({ datos: null, error: response.body, cargando: false });
					}
				}
			})
			.catch(error => {
				setResultado({ datos: null, error, cargando: false });
			})
	}, [setResultado, jwt]);

	useEffect(cargarDatosBalanceadores, [cargarDatosBalanceadores]);

	if (! resultado?.resultados?.length) {
		return <Container>
			<EstadoConsulta resultado={resultado} onRetry={cargarDatosBalanceadores} />
		</Container>
	}

	return <Container>

		<Row className="mt-2 d-flex align-items-center justify-content-center">
			<Col sm={6} lg={4} className="text-center border-bottom pb-2">
				<h4 className="m-0">Entrada pedidos</h4>
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
				{(resultado.resultados.length > 0) && 
					resultado.resultados.filter( bal => bal.subtype === 'fedicom').map((bal, i) => <ServidorApache key={i} datos={bal} />)
				}
			</Col>

			<Col sm={1} className="d-none d-sm-inline-block"><Icono icono={TiArrowShuffle} posicion={[60,16]} /></Col>
			<Col xs={12} className="text-center d-sm-none border-bottom pb-2 mb-2">
				<Icono icono={TiArrowDown} posicion={[60, 16]} />
				<h4 className="m-0">Envío a SAP</h4>
				<span className="m-0 text-muted"><small>Salida del concentrador hacia SAP</small></span>
			</Col>

			<Col sm={5} lg={4}>
				{(resultado.resultados.length > 0) &&
					resultado.resultados.filter(bal => bal.subtype === 'sap').map((bal, i) => <ServidorApache key={i} datos={bal} />)
				}
			</Col>
		</Row>

	</Container>

}


const ServidorApache = ( {datos, variant} ) => {
	return <Col xs={12}>
		<Link to={`/estado/balanceador/${datos.host}`} className="text-decoration-none">
		<Alert variant={variant ?? 'primary'}>
			<Icono icono={FaBalanceScale} posicion={[22, 4]}/>
				<span className="ml-2 text-uppercase font-weight-bold">{datos.host}</span>
		</Alert>
		</Link>
	</Col>
}



export default EstadoBalanceadores