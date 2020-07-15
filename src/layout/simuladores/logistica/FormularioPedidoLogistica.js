import React from 'react';

import SelectorDeAutenticacionLogistica from './SelectorDeAutenticacionLogistica';
import { InputGroup, Form, Col, Card, Row, Button } from 'react-bootstrap';
import Icono from 'componentes/icono/Icono';
import { FiFastForward, FiRewind } from 'react-icons/fi';
import { useCampoFormulario, CampoFormulario } from '../CampoFormulario';
import { FaRocket } from 'react-icons/fa';



const FormularioPedidoLogistica = ({ hookFormulario, habilitado, onSimular }) => {

	const [codigoCliente, setCodigoCliente] = useCampoFormulario('simuladorLogistica.codigoCliente', hookFormulario);
	const [tipoLogistica, setTipoLogistica] = useCampoFormulario('simuladorLogistica.tipoLogistica', hookFormulario);

	return (
		<Card>
			<Card.Header>
				<b>Simulador</b> - Pedido logística
			</Card.Header>
			<Card.Body>
				<SelectorDeAutenticacionLogistica hookFormulario={hookFormulario} />

				<CampoFormulario titulo="Código de cliente" notas={null} >
					<Form.Control size="sm" type="text" className="text-center col-md-6  col-lg-4" value={codigoCliente} onChange={e => setCodigoCliente(e.target.value)} />
				</CampoFormulario>

				<CampoFormulario titulo="Tipo de logística" notas={null} >
					<InputGroup className="px-0 col-md-6  col-lg-4">
						<InputGroup.Prepend>
							<InputGroup.Text><Icono icono={tipoLogistica === 'I' ? FiRewind : FiFastForward} posicion={[16]} /></InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control size="sm" id="selectorDominio" as="select" value={tipoLogistica} onChange={(e) => { setTipoLogistica(e.target.value) }}>
							<option value="I">Inversa</option>
							<option value="D">Directa</option>
						</Form.Control>
					</InputGroup>
				</CampoFormulario>
			</Card.Body>


			<Row className="my-3">
				<Col xs={12} className="text-center">
					<Button size="lg" disabled={!habilitado} onClick={hookFormulario.handleSubmit(onSimular)}>
						<Icono icono={FaRocket} className="mr-2" />
						Lanzar cobete
					</Button>
				</Col>
			</Row>

		</Card>
	);
}


export default FormularioPedidoLogistica