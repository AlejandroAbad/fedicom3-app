import { useState, useEffect } from 'react';

const convertirValor = (localStorageKey, defaultValue, json) => {
    var valor = localStorage.getItem(localStorageKey);

    if (valor === null) return defaultValue;
    if (valor === 'null') return null;
    if (valor === 'undefined') return undefined;
    if (valor === 'true') return true;
    if (valor === 'false') return false;

    if (json) {

        try {
            return JSON.parse(valor);
        } catch (e) {
            console.error("No se puede convertir a JSON el valor de localStorage." + localStorageKey, valor, e);
            return defaultValue;
        }
    }

    return valor;
}


const useStateLocalStorage = (localStorageKey, defaultValue = null, asJson = true) => {

    const [json] = useState(asJson);
    const [value, setValue] = useState(
        convertirValor(localStorageKey, defaultValue, json)
    );

    useEffect(() => {
        localStorage.setItem(localStorageKey, (json ? JSON.stringify(value) : value));
    });
    return [value, setValue];
};




export default useStateLocalStorage;