import K from 'K';

import React, { useContext } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import 'App.scss';


import ReactJson from 'react-json-view';
// import useStateLocalStorage from 'util/useStateLocalStorage';
import BootstrapMedia from 'componentes/debug/bootstrapMedia/BootstrapMedia';

import BarraNavegacionSuperior from 'layout/barraNavegacionSuperior/BarraNavegacionSuperior';
import FormularioLogin from 'layout/formularioLogin/FormularioLogin';
import ContenedorDeTostadas from 'componentes/tostadas/ContenedorDeTostadas';
import TostadaExpiracionJwt from 'componentes/tostadas/TostadaExpiracionJwt';


import VisorTransmision from 'layout/transmisiones/visor/VisorTransmision';
import BuscadorTransmisiones from 'layout/transmisiones/BuscadorTransmisiones';
import EstadoProcesos from 'layout/status/procesos/EstadoProcesos';
import SimuladorPedidos from 'layout/simuladores/pedidos/SimuladorPedidos';
import PruebaCarga from './layout/simuladores/pruebaCarga/PruebaCarga';

import SimuladorDevoluciones from 'layout/simuladores/devoluciones/SimuladorDevoluciones';
import EstadoBalanceador from 'layout/status/apache/EstadoBalanceador';
import EstadoBalanceadores from 'layout/status/apache/EstadoBalanceadores';
import MD from 'layout/doc/Markdown';
import EstadoMDB from 'layout/status/mongodb/EstadoMDB';
import SimuladorConsultaAlbaranes from 'layout/simuladores/consultaAlbaranes/SimuladorConsultaAlbaranes';
import SimuladorConsultaDevolucion from 'layout/simuladores/devoluciones/SimuladorConsultaDevolucion';
import EstadoDashboard from 'layout/status/dashboard/Dashboard';


import { ContextoAplicacion } from 'contexto';
import SimuladorLogistica from 'layout/simuladores/logistica/SimuladorLogistica';

const App = () => {

	const { jwt, setJwt } = useContext(ContextoAplicacion);

	// Almacena el JWT del usuario logeado
	//const [jwt, setJwt] = useStateLocalStorage('login.jwt', null, true);


	let content = null;



	// Si cuando el usuario entra no hay token o lo hay pero esta caducado o proximo a caducar
	// mostramos login para refrescar el token
	if (!jwt || TostadaExpiracionJwt.calculaJwtTTL(jwt) < 60) {
		content = (<FormularioLogin jwtUpdated={setJwt} />);
	} else {
		content = (
			<Switch>
				<Route
					path="/transmisiones/:txId"
					render={(props) => <VisorTransmision      {...props} jwt={jwt} />} />
				<Route
					path="/transmisiones"
					render={(props) => <BuscadorTransmisiones {...props} jwt={jwt} />} />

				{!K.PRODUCCION &&
					<Route
						path="/simulador/pedidos"
						render={(props) => <SimuladorPedidos {...props} jwt={jwt} />} />
				}
				{!K.PRODUCCION &&
					<Route
						path="/simulador/devoluciones"
						render={(props) => <SimuladorDevoluciones {...props} jwt={jwt} />} />
				}
				{!K.PRODUCCION &&
					<Route
						path="/simulador/logistica"
						render={(props) => <SimuladorLogistica {...props} />} />
				}
				{!K.PRODUCCION &&
					<Route
						path="/simulador/pruebaCarga"
						render={(props) => <PruebaCarga {...props} jwt={jwt} />} />
				}
				<Route
					path="/simulador/consulta/albaranes"
					render={(props) => <SimuladorConsultaAlbaranes {...props} jwt={jwt} />} />
				<Route
					path="/simulador/consulta/devoluciones"
					render={(props) => <SimuladorConsultaDevolucion {...props} jwt={jwt} />} />



				<Route
					path="/estado/mongodb"
					render={(props) => <EstadoMDB {...props} jwt={jwt} />} />
				<Route
					path="/estado/procesos"
					render={(props) => <EstadoProcesos {...props} jwt={jwt} />} />
				<Route
					path="/estado/balanceador/:servidor"
					render={(props) => <EstadoBalanceador {...props} jwt={jwt} />} />
				<Route
					path="/estado/balanceador"
					render={(props) => <EstadoBalanceadores {...props} jwt={jwt} />} />
				<Route
					path="/estado/balanceadores"
					render={(props) => <EstadoBalanceadores {...props} jwt={jwt} />} />

				<Route
					path="/estado/dashboard"
					render={(props) => <EstadoDashboard {...props} jwt={jwt} />} />


				<Route
					path="/doc/manual/:md+"
					render={(props) => <MD {...props} jwt={jwt} />} />

				<Route
					path="/doc"
					render={(props) => <MD {...props} jwt={jwt} />} />

				<Route path="/usuario">
					<h3>Tu JWT</h3>
					<ReactJson src={jwt || {}} />
				</Route>



				<Redirect from="/" to="/transmisiones" />
			</Switch>
		);
	}

	return (
		<Router>
			<BootstrapMedia />
			<BarraNavegacionSuperior onLogout={() => setJwt(null)} jwt={jwt} />

			<div className="App">
				{content}
			</div>

			<ContenedorDeTostadas>
				<TostadaExpiracionJwt jwt={jwt} clearJwt={() => setJwt(null)} />
			</ContenedorDeTostadas>

		</Router>
	);
}






export default App;
