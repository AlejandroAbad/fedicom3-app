import React, { createContext } from 'react';

import useStateLocalStorage from 'util/useStateLocalStorage';


const ContextoAplicacion = createContext(null);
const { Provider } = ContextoAplicacion;

const ProveedorContextoAplicacion = ({ children }) => {

	const [jwt, setJwt] = useStateLocalStorage('login.jwt', null, true);
	//const [var, setVar] = useStateLocalStorage('var', null, true);
	
	return <Provider value={{ jwt, setJwt /*, var, setVar*/ }}>{children}</Provider>;
};

export { ContextoAplicacion, ProveedorContextoAplicacion };
export default ContextoAplicacion;