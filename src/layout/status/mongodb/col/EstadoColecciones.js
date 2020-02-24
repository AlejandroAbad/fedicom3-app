import K from 'K'
import React, { useState, useEffect } from 'react'
import { Container, Form, Row, Col, ListGroup, Badge } from 'react-bootstrap'
import fedicomFetch from 'util/fedicomFetch'
import ConsultaCargando from 'componentes/estadoConsulta/ConsultaCargando'
import ConsultaError from 'componentes/estadoConsulta/ConsultaError'
import ListGroupItem from 'layout/transmisiones/visor/ListGroupItem'
import Icono from 'componentes/icono/Icono'
import humanFileSize from 'util/humanFileSize'
import { MdCollections } from 'react-icons/md'




const EstadoColecciones = ({jwt}) => {

	const [resultado, setResultado] = useState({ cargando: true, datos: null, error: null })
	const [colSeleccionada, setColSeleccionada] = useState('tx')
	
	useEffect(() => {
		fedicomFetch(K.DESTINOS.MONITOR + '/status/mdb/col', { method: 'GET' }, jwt)
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
			<Container className="mt-4">
				<ConsultaCargando texto="Cargando lista de colecciones ..." />
			</Container>
		)
	}

	let colecciones = resultado?.datos?.data;

	if (resultado.error || !colecciones) {

		return <Container className="mt-4"><ConsultaError titulo="Error al obtener la lista de colecciones"  errores={resultado.error} /></Container>
	}

	return (
		<Container className="mt-4">
			<h3 className="mb-0 text-monospace">Colecciones</h3>
			<span className="text-muted "><Icono icono={MdCollections} posicion={[22, 2]} /> Colecciones de la base de datos</span>
			<hr />
			
			<Form.Control as="select" defaultValue={colSeleccionada} onChange={(e) => setColSeleccionada(e.target.value)}>
				{ colecciones.map( (col,i ) => <option key={i} value={col}>{col}</option>)}
			</Form.Control>
			<DetalleColeccion jwt={jwt} coleccion={colSeleccionada} />
		</Container>
	)


}

const DetalleColeccion = ({jwt, coleccion}) => {

	const [resultado, setResultado] = useState({ cargando: true, datos: null, error: null })

	useEffect(() => {
		setResultado({ cargando: true, datos: null, error: null });
		fedicomFetch(K.DESTINOS.MONITOR + '/status/mdb/col/' + coleccion , { method: 'GET' }, jwt)
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
	}, [setResultado, coleccion, jwt]);

	if (resultado.cargando) {
		return <ConsultaCargando texto={`Cargando estado de la colección ${coleccion} ...`} />
		
	}

	let col = resultado?.datos?.data;

	if (resultado.error || !col) {
		return <ConsultaError titulo="Error al obtener los datos de la colección" errores={resultado.error} />
	}

	let datosCapped = null;
	if (col.capped) {
		if (col.max > 0 && col.maxSize > 0) {
			datosCapped = <>
				<span>Tamaño máximo: {humanFileSize(col.maxSize, false)}</span><br />
				<span>Límite documentos: {humanFileSize(col.max, true)}</span>
			</>
		}
		else if (col.maxSize > 0) {
			datosCapped = <>
				<span>Tamaño máximo: {humanFileSize(col.maxSize, false)}</span>
			</>
		} else 	if (col.max > 0) {
			datosCapped = <>
				<span>Límite documentos: {humanFileSize(col.max, true)}</span>
			</>
		} else {
			datosCapped = <Badge variant="info">SI</Badge>
		}

	}

	return <>
		<Row className="mt-2">
			<Col md={6}>
				<ListGroup className="list-group-flush">
					<ListGroupItem k="Tamaño en disco" v={humanFileSize(col.storageSize, false)} />
					<ListGroupItem k="Tamaño documentos" v={humanFileSize(col.size)} />
					{col.capped && <ListGroupItem k="Colección capada" v={datosCapped} />}
				</ListGroup>
			</Col>
			<Col md={6}>
				<ListGroup className="list-group-flush border-top border-md-top-0">
					<ListGroupItem k="Documentos" v={humanFileSize(col.count, true)} />
					<ListGroupItem k="Tamaño medio de objeto" v={humanFileSize(col.avgObjSize, false)} />
				</ListGroup>
			</Col>
		</Row>
		<Col xs={12} className="mt-2">
			<ListGroup className="border-top border-md-top-0">
				<ListGroupItem  k="Índice" v="Tamaño" className="bg-secondary-soft py-2"/>
				{Object.keys(col.indexSizes).map((index, i) => <ListGroupItem key={i} k={index} v={humanFileSize(col.indexSizes[index], false)} className=" py-2" />) }
			</ListGroup>
		</Col>
	</>

}

export default EstadoColecciones