//import K from 'K';

import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import 'App.scss';

import { Container } from 'react-bootstrap';
import ReactJson from 'react-json-view';

import BootstrapMedia from 'componentes/bootstrapMedia/BootstrapMedia';
import BarraSuperior from 'componentes/barraSuperior/BarraSuperior';
import FormularioLogin from 'componentes/formularioLogin/FormularioLogin';
import VisorTransmision from 'componentes/transmisiones/VisorTransmision';
import BuscadorTransmisiones from 'componentes/transmisiones/BuscadorTransmisiones';

import useStateLocalStorage from 'util/useStateLocalStorage';
import useInterval from 'util/useInterval';

import ContenedorDeTostadas from 'componentes/tostadas/ContenedorDeTostadas';
import TostadaExpiracionJwt from 'componentes/tostadas/TostadaExpiracionJwt';



const App = () => {

  // Almacena el JWT del usuario logeado
  const [jwt, _setJwt] = useStateLocalStorage('login.jwt', null, true);
  const [jwtTTL, setJwtTTL] = React.useState(0);

  const setJwt = (jwt) => {
    _setJwt(jwt);
    setJwtTTL(calculaJwtTTL(jwt));
  }

  useInterval(() => {
    let ttl = calculaJwtTTL(jwt);
    if (ttl <= 0 && jwt) setJwt(null);
    setJwtTTL(ttl);
  }, 1000);




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

      <Container fluid className="App">
        {content}
      </Container>

      <ContenedorDeTostadas>
        <TostadaExpiracionJwt jwt={jwt} jwtTTL={jwtTTL} clearJwt={() => setJwt(null)} />
      </ContenedorDeTostadas>

    </Router>
  );
}


const calculaJwtTTL = (jwt) => {
  if (!jwt || !jwt.data || !jwt.data.exp) return 0;
  let now = (new Date()).getTime() / 1000;
  return Math.round(jwt.data.exp - now);

}



export default App;
