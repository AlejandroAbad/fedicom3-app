import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EstadoBalanceo from './EstadoBalanceo';
import EstadoBaseDatos from './EstadoBaseDatos';
import EstadoDumps from './EstadoDumps';
import EstadoSqlite from './EstadoSqlite';
import EstadoSap from './EstadoSap';
import EstadoProcesos from './EstadoProcesos';
import EstadoPedidos from './EstadoPedidos';
import EstadoFlujos from './EstadoFlujos';


const EstadoDashboard = () => {


	return 	<Container fluid>
		<Row>
			<Col xl={8}>
				<EstadoPedidos />
			</Col>
			<Col xl={4}>
				<EstadoFlujos />
			</Col>
		</Row>
		

		<EstadoBalanceo  />
		<EstadoBaseDatos />
		<EstadoDumps />
		<EstadoSqlite />
		<EstadoSap />
		<EstadoProcesos />
	</Container>
	





}


export default EstadoDashboard;
