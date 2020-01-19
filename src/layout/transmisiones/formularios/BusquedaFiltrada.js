import React from 'react'

const BusquedaFiltrada = ({ filtro, register, errors, ...props }) => {
	return (
		<Container fluid>
			<Row>
				<Col lg={12} className="mt-2">
					<h5 className="text-muted">Opciones de búsqueda</h5><hr />
				</Col>

				<Col lg={6}>
					<Form.Group>
						<Form.Label>Tipo de transmisión:</Form.Label>
						<Form.Control type="text" placeholder="type" size="sm" />
					</Form.Group>
				</Col>
				<Col lg={6}>
					<Form.Group>
						<Form.Label>Estado de la transmisión:</Form.Label>
						<Form.Control type="text" placeholder="status" size="sm" />
					</Form.Group>
				</Col>
				<Col lg={4}>
					<Form.Group>
						<Form.Label>Codigo de cliente:</Form.Label>
						<Form.Control type="text" placeholder="authenticatingUser | client" size="sm" />
					</Form.Group>
				</Col>
				<Col lg={8}>
					<Form.Group>
						<Form.Label>Entre fechas:</Form.Label>
						<Form.Control type="text" placeholder="createdAt" size="sm" />
					</Form.Group>
				</Col>
				<Col lg={3}>
					<Form.Group>
						<Form.Label>Almacén:</Form.Label>
						<Form.Control type="text" placeholder="client*.body.codigoAlmacenServicio" size="sm" />
					</Form.Group>
				</Col>
				<Col lg={3}>
					<Form.Group>
						<Form.Label>Tipo pedido:</Form.Label>
						<Form.Control type="text" placeholder="client*.body.tipoPedido | flags.t" size="sm" />
					</Form.Group>
				</Col>
				<Col lg={3}>
					<Form.Group>
						<Form.Label>Número de líneas:</Form.Label>
						<Form.Row>
							<Col sm={5} lg={4}>
								<Form.Control type="text" placeholder="flags.s.lineas $min" size="sm" />
							</Col>
							-
                            <Col sm={5} lg={4}>
								<Form.Control type="text" placeholder="flags.s.lineas $max" size="sm" />
							</Col>
						</Form.Row>
					</Form.Group>
				</Col>
				<Col lg={3}>
					<Form.Group>
						<Form.Label>Dirección IP:</Form.Label>
						<Form.Control type="text" placeholder="clientRequest.ip" size="sm" />
					</Form.Group>
				</Col>
				<Col lg={12}>
					<Form.Group>
						<Form.Label>Flags:</Form.Label>
						<Form.Control type="text" placeholder="flags.*" size="sm" />
					</Form.Group>
				</Col>

				<Col lg={12} className="mt-5">
					<h5 className="text-muted">Opciones avanzadas</h5><hr />
				</Col>

				<Col lg={3}>
					<Form.Group>
						<Form.Label>IID Servidor:</Form.Label>
						<Form.Control type="text" placeholder="iid" size="sm" />
					</Form.Group>
				</Col>
				<Col lg={4}>
					<Form.Group>
						<Form.Label>Software de Farmacia:</Form.Label>
						<Form.Control type="text" placeholder="clientRequest.headers.software-id" size="sm" />
					</Form.Group>
				</Col>
			</Row>
		</Container>
	)
}

export default BusquedaFiltrada