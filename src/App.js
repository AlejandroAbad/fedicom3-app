//import K from 'K';

import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import 'App.scss';

import { Container } from 'react-bootstrap';

import BootstrapMedia from 'componentes/bootstrapMedia/BootstrapMedia';
import BarraSuperior from 'componentes/barraSuperior/BarraSuperior';
import FormularioLogin from 'componentes/formularioLogin/FormularioLogin';
import VisorTransmision from 'componentes/transmisiones/VisorTransmision';
import BuscadorTransmisiones from 'componentes/transmisiones/BuscadorTransmisiones';

import useStateLocalStorage from 'util/useStateLocalStorage';

function App() {

  // Almacena el JWT del usuario logeado
  const [jwt, setJwt] = useStateLocalStorage('login.jwt', null, true);


  let content = null;

  if (!jwt) {
    content = (<FormularioLogin jwtUpdated={(jwt) => setJwt(jwt)} />);
  } else {
    content = (
      <Switch>
        <Route
          path="/logout"
          render={(props) => <Redirect to="/" />} />
        <Route
          path="/transmisiones/:txId"
          render={(props) => <VisorTransmision      {...props} jwt={jwt} />} />
        <Route
          path="/transmisiones"
          render={(props) => <BuscadorTransmisiones {...props} jwt={jwt} />} />

        <Route path="/">
          <h3>Tu JWT</h3>
          <code>{JSON.stringify(jwt)}</code>
        </Route>
      </Switch>
    );
  }

  return (
    <Router>
      <BootstrapMedia />
      <BarraSuperior onLogout={() => setJwt(null)} />

      <Container fluid className="App">
        {content}
      </Container>
    </Router>
  );
}

export default App;
