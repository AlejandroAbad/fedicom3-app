import K from 'K'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import fedicomFetch from 'util/fedicomFetch'
import { Container } from 'react-bootstrap'
import DepuradorAPI from 'componentes/debug/depuradorApi/DepuradorApi'
import DataTable from 'react-data-table-component'
import Fecha from 'componentes/transmision/Fecha'
import moment from 'moment'

console.log('locale', moment.locale('sp'));





const columns = [
	{
		name: 'Proceso',
		selector: 'type',
		sortable: true,
		cell: row => row.type.toUpperCase(),
	},
	{
		name: 'Host',
		selector: 'host',
		sortable: true,
		cell: row => row.host.toLowerCase(),
	},
	{
		name: 'PID',
		/*selector: 'pid',
		sortable: true,*/
		cell: row => <div>{row.workerId ? row.pid + ' #' + row.workerId : row.pid}</div>,
	},
	{
		name: 'Iniciado hace',
		selector: 'init',
		sortable: true,
		cell: row => {
			
			let duration = moment.duration(moment().diff(moment(row.init, 'x')));
			return <>
				{duration.toISOString().substring(2).toLowerCase()}
			</>
		}
	},
	{
		name: 'HB',
		selector: 'timestamp',
		sortable: true,
		cell: row => {
			let duration = moment.duration(moment().diff(moment(row.timestamp, 'x')));
			return <>
				{duration.toISOString().substring(2).toLowerCase()}
			</>
		}
	},
	{
		name: 'Estado',
		selector: 'status',
		sortable: true,
	},
];

const EstadoProcesos = ({ jwt, ...props }) => {


	const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false })


	// Para no perder el ultimo resultado entre cargas de mas resultados
	const ultimoResultado = useRef(resultado);

	if (resultado !== ultimoResultado.current) ultimoResultado.current = resultado;


	const ejecutarConsulta = useCallback(() => {
		setResultado({ datos: ultimoResultado.current.datos, error: ultimoResultado.current.error, cargando: true });

		fedicomFetch(K.DESTINOS.MONITOR + '/status/proc', { method: 'GET' }, jwt)
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

	useEffect(() => {
		ejecutarConsulta()
	}, [ejecutarConsulta])



	return <>
		<Container>
			<DataTable
				title="Movie List"
				columns={columns}
				data={resultado?.datos?.data}
				defaultSortField="type"
			/*selectableRows={selectableRows}
			selectableRowsNoSelectAll={noSelectAll}
			selectableRowsHighlight={selectableRowsHighlight}
			expandableRows={expandableRows}
			expandOnRowClicked={expandOnRowClick}
			pagination={pagination}
			highlightOnHover={highlight}
			striped={striped}
			pointerOnHover={pointer}
			dense={dense}
			noTableHead={tableHead}
			persistTableHead={persist}
			progressPending={loading}
			noHeader={noHeader}
			subHeader={subHeader}
			subHeaderComponent={
				(
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<TextField id="outlined-basic" label="Search" variant="outlined" size="small" style={{ margin: '5px' }} />
						<Icon1 style={{ margin: '5px' }} color="action" />
						<Icon2 style={{ margin: '5px' }} color="action" />
						<Icon3 style={{ margin: '5px' }} color="action" />
					</div>
				)
			}
			subHeaderAlign={subHeaderAlign}
			fixedHeader={fixedHeader}
			fixedHeaderScrollHeight="300px"*/
			/>


			<DepuradorAPI id="processStatus" resultado={resultado} query={{}} />
		</Container>
	</>


}





export default EstadoProcesos