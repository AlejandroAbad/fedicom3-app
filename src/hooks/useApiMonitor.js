import K from 'K';
import { useState, useRef, useCallback, useEffect } from 'react';
import fedicomFetch from 'util/fedicomFetch';
import valueEquals from 'util/valueEquals';

export const useApiMonitor = (url, token, opciones) => {

	// A diferencia de 'url' y 'token' que son Strings y se comparan por valor, 
	// opciones es un objeto y se comparará por referencia. Por tanto, debemos 
	// hacer una comprobación profunda para comprobar si el objeto ha cambiado
	// realmente o no.
	const refOpciones = useRef();
	if (!refOpciones.current) {
		refOpciones.current = opciones || { method: 'GET' }
	} else {
		if (!valueEquals(opciones, refOpciones.current)) {
			refOpciones.current = opciones
		}
	}

	const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false, respuesta: null, query: null })

	// Para no perder el ultimo resultado entre cargas de mas resultados
	const ultimoResultado = useRef(resultado);
	if (resultado !== ultimoResultado.current) ultimoResultado.current = resultado;

	const ejecutarConsulta = useCallback(() => {

		let { body, ...opcionesHttp } = refOpciones.current;
		setResultado({
			datos: ultimoResultado.current?.datos,
			error: ultimoResultado.current?.error,
			cargando: true,
			respuesta: ultimoResultado.current?.respuesta,
			query: ultimoResultado.current?.query
		});

		fedicomFetch(K.DESTINOS.MONITOR + url, opcionesHttp, token, body)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ datos: response.body, error: null, cargando: false, respuesta: response, query: body });
					} else {
						setResultado({ datos: null, error: response.body, cargando: false, respuesta: response, query: body });
					}
				}

			})
			.catch(error => {
				setResultado({ datos: null, error, cargando: false, respuesta: null, query: body });
			})
	}, [setResultado, url, token, refOpciones])

	useEffect(() => {
		ejecutarConsulta()
	}, [ejecutarConsulta])

	return {
		ejecutarConsulta,
		resultado,
		setResultado
	}

}

export const useApiSimulador = (url, token, opciones) => {

	// A diferencia de 'url' y 'token' que son Strings y se comparan por valor, 
	// opciones es un objeto y se comparará por referencia. Por tanto, debemos 
	// hacer una comprobación profunda para comprobar si el objeto ha cambiado
	// realmente o no.
	const refOpciones = useRef();
	if (!refOpciones.current) {
		refOpciones.current = opciones || { method: 'GET' }
	} else {
		if (!valueEquals(opciones, refOpciones.current)) {
			refOpciones.current = opciones
		}
	}

	const [resultado, setResultado] = useState({ datos: null, error: null, cargando: false, respuesta: null, query: null })

	// Para no perder el ultimo resultado entre cargas de mas resultados
	const ultimoResultado = useRef(resultado);
	if (resultado !== ultimoResultado.current) ultimoResultado.current = resultado;

	const ejecutarSimulacion = useCallback((vars) => {
		if (!vars) vars = {};
		let opciones = { ...refOpciones.current, ...vars}
		let { body, ...opcionesHttp } = opciones;

		setResultado({
			datos: ultimoResultado.current?.datos,
			error: ultimoResultado.current?.error,
			cargando: true,
			respuesta: ultimoResultado.current?.respuesta,
			query: ultimoResultado.current?.query
		});
		

		fedicomFetch(K.DESTINOS.CORE + url, opcionesHttp, token, body)
			.then(response => {
				if (response) {
					if (response.ok) {
						setResultado({ datos: response.body, error: null, cargando: false, respuesta: response, query: body });
					} else {
						setResultado({ datos: null, error: response.body, cargando: false, respuesta: response, query: body });
					}
				}

			})
			.catch(error => {
				setResultado({ datos: null, error, cargando: false, respuesta: null, query: body });
			})
	}, [setResultado, url, token, refOpciones])

	return {
		ejecutarSimulacion,
		resultado,
		setResultado
	}

}