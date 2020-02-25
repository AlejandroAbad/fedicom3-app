import React from 'react'
import EstadoColecciones from './col/EstadoColecciones'
import EstadoDatabase from './db/EstadoDatabase'
import EstadoReplicaSet from './rs/EstadoReplicaSet'
import OperacionesMdb from './op/OperacionesMdb'
import LogMBD from './log/LogMBD'
import { Container, Nav } from 'react-bootstrap'
import useStateLocalStorage from 'util/useStateLocalStorage'


const EstadoMDB = (props) => {

	const [tab, setTab] = useStateLocalStorage('mdbstatus.statusTab', 'cluster', false)


	let contenido = null

	switch(tab) {
		case 'cluster':
			contenido = <EstadoReplicaSet {...props} />
			break;
		case 'db':
			contenido = <EstadoDatabase {...props} />
			break;
		case 'col':
			contenido = <EstadoColecciones {...props} />
			break;
		case 'op':
			contenido = <OperacionesMdb {...props} />
			break;
		case 'log':
			contenido = <LogMBD {...props} />
			break;
		default:
			contenido = <h1>TBD</h1>
			break;
	}


	return (
		<>
			<Container fluid className="border-bottom pb-2 mb-2">
				<Nav className="justify-content-center" variant="pills">
					<Nav.Item><Nav.Link active={tab === 'cluster'} onClick={() => setTab('cluster')}>Cluster</Nav.Link></Nav.Item>
					<Nav.Item><Nav.Link active={tab === 'db'} onClick={() => setTab('db')}>Base de datos</Nav.Link></Nav.Item>
					<Nav.Item><Nav.Link active={tab === 'col'} onClick={() => setTab('col')}>Colecciones</Nav.Link></Nav.Item>
					<Nav.Item><Nav.Link active={tab === 'op'} onClick={() => setTab('op')}>Operaciones</Nav.Link></Nav.Item>
					<Nav.Item><Nav.Link active={tab === 'log'} onClick={() => setTab('log')}>Logs</Nav.Link></Nav.Item>
				</Nav>
			</Container>

			{contenido}
		</>
	)


}




export default EstadoMDB