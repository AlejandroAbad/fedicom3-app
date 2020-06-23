import React from 'react';
import { Container } from 'react-bootstrap';
import EstadoBalanceo from './EstadoBalanceo';
import EstadoBaseDatos from './EstadoBaseDatos';
import EstadoDumps from './EstadoDumps';
import EstadoSqlite from './EstadoSqlite';
import EstadoSap from './EstadoSap';
import EstadoProcesos from './EstadoProcesos';


const EstadoDashboard = ({jwt}) => {


	return 	<Container fluid>
		<h1>Estado general</h1>
		<EstadoBalanceo jwt={jwt} />
		<EstadoBaseDatos jwt={jwt} />
		<EstadoDumps jwt={jwt} />
		<EstadoSqlite jwt={jwt} />
		<EstadoSap jwt={jwt} />
		<EstadoProcesos jwt={jwt} />
	</Container>
	





}


export default EstadoDashboard;
