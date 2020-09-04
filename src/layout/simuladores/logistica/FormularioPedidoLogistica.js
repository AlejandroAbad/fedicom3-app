import React from 'react';

import SelectorDeAutenticacionLogistica from './SelectorDeAutenticacionLogistica';
import { InputGroup, Form, Col, Card, Row, Button } from 'react-bootstrap';
import Icono from 'componentes/icono/Icono';
import { FiFastForward, FiRewind } from 'react-icons/fi';
import { useCampoFormulario, CampoFormulario } from '../CampoFormulario';
import { FaRocket } from 'react-icons/fa';

const DESTINOS = {
	LI00000014: 'Asesoría laboral',
	LI00000015: 'Hefame Informática',
	LI00000017: 'Servicios integrales',
	LI00000019: 'Seguros'
};


const FormularioPedidoLogistica = ({ hookFormulario, habilitado, onSimular }) => {

	const [codigoCliente, setCodigoCliente] = useCampoFormulario('simuladorLogistica.codigoCliente', hookFormulario, '');
	const [tipoLogistica, setTipoLogistica] = useCampoFormulario('simuladorLogistica.tipoLogistica', hookFormulario, 'I');
	const [codigoOrigen, setCodigoOrigen] = useCampoFormulario('simuladorLogistica.codigoOrigen', hookFormulario, '');
	const [codigoDestino, setCodigoDestino] = useCampoFormulario('simuladorLogistica.codigoDestino', hookFormulario, 'LI00000015');
	const [numeroLogisticaOrigen, setNumeroLogisticaOrigen] = useCampoFormulario('simuladorLogistica.numeroLogisticaOrigen', hookFormulario, '');
	const [observaciones, setObservaciones] = useCampoFormulario('simuladorLogistica.observaciones', hookFormulario, '');
	const [numeroLineas, setNumeroLineas] = useCampoFormulario('simuladorLogistica.numeroLineas', hookFormulario, 1);

	const opcionesDesplegableDestinos = [];

	let i = 0;
	for(let destino in DESTINOS) {
	opcionesDesplegableDestinos.push(<option key={i++} value={destino}>{destino} - {DESTINOS[destino]}</option>)
	}


	return (
		<Card>
			<Card.Header>
				<b>Simulador</b> - Pedido logística
			</Card.Header>
			<Card.Body>
				<SelectorDeAutenticacionLogistica hookFormulario={hookFormulario} />

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

				<CampoFormulario titulo="Código de cliente" notas={null} >
					<Form.Control size="sm" type="text" className="text-center col-md-6  col-lg-4" value={codigoCliente} onChange={e => setCodigoCliente(e.target.value)} />
				</CampoFormulario>

				<CampoFormulario titulo="Origen" notas="Generalmente, se usará el código de cliente para este campo." >
					<Form.Control size="sm" type="text" className="text-center col-md-6 col-lg-4" value={codigoOrigen} onChange={e => setCodigoOrigen(e.target.value)} />
				</CampoFormulario>

				<CampoFormulario titulo="Destino" notas={null} >
					<InputGroup className="px-0 col-md-6  col-lg-4">
						<Form.Control size="sm" id="selectorDestino" as="select" value={codigoDestino} onChange={(e) => { setCodigoDestino(e.target.value) }}>
							{opcionesDesplegableDestinos}
						</Form.Control>
					</InputGroup>
				</CampoFormulario>

				<CampoFormulario titulo="Número logística origen" notas="Si el valor se deja en blanco, se generará un número aleatorio para cada petición." >
					<Form.Control size="sm" type="text" className="text-center col-md-6 col-lg-4" value={numeroLogisticaOrigen} onChange={e => setNumeroLogisticaOrigen(e.target.value)} />
				</CampoFormulario>

				<CampoFormulario titulo="Observaciones" >
					<Form.Control size="sm" type="text" className="col-lg-11" value={observaciones} onChange={e => setObservaciones(e.target.value)} />
				</CampoFormulario>

				<CampoFormulario titulo="Número de bultos" >
					<InputGroup className="px-0 col-md-6  col-lg-4">
						<Form.Control size="sm" type="text" className="col-lg-11" value={numeroLineas} onChange={e => setNumeroLineas(Math.max(1, isNaN(parseInt(e.target.value)) ? 1 : parseInt(e.target.value) ))} />
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