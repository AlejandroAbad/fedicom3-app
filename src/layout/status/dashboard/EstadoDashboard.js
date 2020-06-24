import React from 'react';
import { Container } from 'react-bootstrap';
import EstadoBalanceo from './EstadoBalanceo';
import EstadoBaseDatos from './EstadoBaseDatos';
import EstadoDumps from './EstadoDumps';
import EstadoSqlite from './EstadoSqlite';
import EstadoSap from './EstadoSap';
import EstadoProcesos from './EstadoProcesos';
import EstadoPedidos from './EstadoPedidos';


const EstadoDashboard = () => {


	return 	<Container className="border">
		
		<EstadoPedidos />
		<EstadoBalanceo  />
		<EstadoBaseDatos />
		<EstadoDumps />
		<EstadoSqlite />
		<EstadoSap />
		<EstadoProcesos />
	</Container>
	





}


export default EstadoDashboard;
