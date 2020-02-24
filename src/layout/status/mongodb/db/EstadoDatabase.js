import K from 'K'
import React, { useState, useEffect } from 'react'
import { Container, ProgressBar, Row, Col, ListGroup } from 'react-bootstrap'
import fedicomFetch from 'util/fedicomFetch'
import ConsultaCargando from 'componentes/estadoConsulta/ConsultaCargando'
import ConsultaError from 'componentes/estadoConsulta/ConsultaError'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem'
import Icono from 'componentes/icono/Icono'
import { FaDatabase } from 'react-icons/fa'
import humanFileSize from 'util/humanFileSize'


const EstadoDatabase = ({jwt}) => {

	const [resultado, setResultado] = useState({ cargando: true, datos: null, error: null })

	useEffect(() => {
		fedicomFetch(K.DESTINOS.MONITOR + '/status/mdb/db', { method: 'GET' }, jwt)
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
				<ConsultaCargando texto="Cargando estado de la base de datos ..." />
			</Container>
		)
	}

	let db = resultado?.datos?.data;

	if (resultado.error || !db) {
		return <ConsultaError errores={resultado.error} />
	}


	let porcentajeComprimido = Math.ceil(db.storageSize * 100 / db.fsTotalSize)
	let porcentajeOcupado = Math.ceil(db.fsUsedSize * 100 / db.fsTotalSize)
	
	let varianteComprimido = (porcentajeComprimido < 75) ? 'success' : ((porcentajeComprimido < 90) ? 'warning' : 'danger') 
	let varianteOcupado = "dark"

	let compresion = <>
		<span>{humanFileSize(db.storageSize, false)}</span><br />
		<small><b>{humanFileSize(db.dataSize, false)}</b> sin comprimir</small><br/>
		<small>Ratio <b >1 : {(db.dataSize / db.storageSize).toFixed(1)}</b></small>
	</>
	

	return (
		<Container className="mt-4">
			<h3 className="mb-0 text-monospace">Base de datos <b>{db.db}</b></h3>
			<span className="text-muted "><Icono icono={FaDatabase} posicion={[22, 2]} /> Estado de la base de datos</span>
			<hr />
		
			<ProgressBar style={{height: '40px'}}>
				<ProgressBar variant={varianteComprimido} now={porcentajeComprimido} key={2} label={<span>{porcentajeComprimido}%</span>}/>
				<ProgressBar variant={varianteOcupado} now={porcentajeOcupado - porcentajeComprimido} key={1} label={<span>{porcentajeOcupado}%</span>}/>
			</ProgressBar>

			<Row className="mt-2">
				<Col md={6}>
					<ListGroup className="list-group-flush">
						
						
						<ListGroupItem k="Disco reclamado" v={humanFileSize(db.fsUsedSize, false)} />
						<ListGroupItem k="Disco total" v={humanFileSize(db.fsTotalSize)} />
						<ListGroupItem k="Tamaño de datos" v={compresion} />
					</ListGroup>
				</Col>
				<Col md={6}>
					<ListGroup className="list-group-flush border-top border-md-top-0">
						<ListGroupItem k="Objetos" v={humanFileSize(db.objects,true)} />
						<ListGroupItem k="Tamaño medio de objeto" v={humanFileSize(db.avgObjSize, false)} />
						<ListGroupItem k="Número de índices" v={db.indexes} />
						<ListGroupItem k="Tamaño en índices" v={humanFileSize(db.indexSize, false)} />
					</ListGroup>
				</Col>
			</Row>


		</Container>
	)


}

export default EstadoDatabase