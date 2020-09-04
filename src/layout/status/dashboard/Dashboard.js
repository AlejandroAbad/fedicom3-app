import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
/*
import EstadoBalanceo from './EstadoBalanceo';
import EstadoBaseDatos from './EstadoBaseDatos';
import EstadoDumps from './EstadoDumps';
import EstadoSqlite from './EstadoSqlite';
import EstadoSap from './EstadoSap';
import EstadoProcesos from './EstadoProcesos';
*/
import EstadoFlujoPedidos from './EstadoFlujoPedidos';
import EstadoOtrosFlujos from './EstadoOtrosFlujos';


const EstadoDashboard = () => {


	return 	<Container fluid >
		<Row className="no-gutters text-center">
			<Col xl={8}>
				<EstadoFlujoPedidos />
			</Col>
			<Col xl={4}>
				<EstadoOtrosFlujos />
			</Col>
		</Row>
		

		{/*<EstadoBalanceo  />
		<EstadoBaseDatos />
		<EstadoDumps />
		<EstadoSqlite />
		<EstadoSap />
		<EstadoProcesos />*/}
	</Container>
	





}


export default EstadoDashboard;
