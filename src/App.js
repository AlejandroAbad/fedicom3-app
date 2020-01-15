//import K from 'K';

import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import 'App.scss';

import { Container } from 'react-bootstrap';
import ReactJson from 'react-json-view';

import BootstrapMedia from 'componentes/debug/bootstrapMedia/BootstrapMedia';
import BarraSuperior from 'componentes/barraSuperior/BarraSuperior';
import FormularioLogin from 'componentes/formularioLogin/FormularioLogin';
import VisorTransmision from 'componentes/transmisiones/VisorTransmision';
import BuscadorTransmisiones from 'componentes/transmisiones/BuscadorTransmisiones';

import useStateLocalStorage from 'util/useStateLocalStorage';


import ContenedorDeTostadas from 'componentes/tostadas/ContenedorDeTostadas';
import TostadaExpiracionJwt from 'componentes/tostadas/TostadaExpiracionJwt';

const App = () => {

  // Almacena el JWT del usuario logeado
  const [jwt, setJwt] = useStateLocalStorage('login.jwt', null, true);
  

  let content = null;

  if (!jwt) {
    content = (<FormularioLogin jwtUpdated={(jwt) => setJwt(jwt)} />);
  } else {
    content = (
      <Switch>
        <Route
          path="/transmisiones/:txId"
          render={(props) => <VisorTransmision      {...props} jwt={jwt} />} />
        <Route
          path="/transmisiones"
          render={(props) => <BuscadorTransmisiones {...props} jwt={jwt} />} />

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
      <BarraSuperior onLogout={() => setJwt(null)} jwt={jwt} />

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
