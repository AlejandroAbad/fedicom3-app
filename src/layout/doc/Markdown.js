import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown/with-html'
import { Link } from 'react-router-dom'
import { Container, Alert, Spinner, Col, Button } from 'react-bootstrap'
import './Markdown.scss'
import Icono from 'componentes/icono/Icono'
import { TiArrowBack } from 'react-icons/ti'
import { LinkContainer } from 'react-router-bootstrap'

const MD = (props) => {

	const [md, setMd] = useState({ error: null, md: null, cargando: false, path: '' });

	useEffect(() => {


		console.log(props?.match)
		let mdFile = props?.match?.params?.md ?? 'index';

		let mdPath = null;
		try {
			mdPath = require('doc/' + mdFile + '.md');
		} catch (err) {
		}



		if (mdPath) {
			fetch(mdPath)
				.then(response => response.text())
				.then(text => {
					setMd({ error: null, md: text, cargando: false, path: mdFile })
				})
				.catch(err => {
					setMd({ error: err, md: null, cargando: false, path: mdFile })
				})
		} else {
			setMd({ error: new Error('No existe el manual'), md: null, cargando: false, path: mdFile })
		}

	}, [props])

	if (md.cargando) {
		return <Container>
			<Alert variant='primary' className="text-center mt-3">
				<Spinner animation="border" variant="primary" className="mt-2" />
				<h5 className="pt-2">Cargando documentación ...</h5>
			</Alert>
		</Container>
	}

	if (md.error) {
		return <Container>
			<Alert variant='danger' className="text-center mt-3">
				<h5 className="my-2">{md.error.message}</h5>
			</Alert>
		</Container>
	}





	return <Container>
		{md.path !== 'index' && md.cargando === false && <LinkContainer to="/doc/manual" className="float-right">
			<Button variant="light" className="pb-1 pr-3">
				<Icono icono={TiArrowBack} posicion={[28, 2]} /> Índice
		</Button>
		</LinkContainer>}
		<ReactMarkdown
			className="Markdown"
			source={md.md}
			escapeHtml={false}
			renderers={{ image: Imagen, link: Enlace }}
		/>
	</Container>

}


const Imagen = ({ alt, ...props }) => {
	return <Col xs={12} className="text-center">
		<img alt={alt} {...props} style={{ maxWidth: '100%' }} className="border p-2 m-2" />
		<br />
		{alt && <span className="text-muted">{alt}</span>}
	</Col>

}

const Enlace = ({ href, ...props }) => {
	href = href.replace('$DOC$', '/doc/manual')
	return <Link to={href} {...props}>{props.children}</Link>
}



export default MD