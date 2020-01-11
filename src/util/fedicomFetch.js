
const jsonFetch = async (url, options = {}, body = null) => {

    options.mode = 'cors';

    if (body) {
        options.body = JSON.stringify(body);
        if (options.headers)
            options.headers['Content-Type'] = 'application/json';
        else 
            options.headers = {'Content-Type' : 'application/json'};
        if (!options.method) options.method = 'POST';
    }

    const r = await fetch(url, options);
    const data = await r.json();
    return ({
        ok: (r.status >= 200 && r.status < 300),
        status: r.status,
        body: data
    });
}

const fedicomFetch = (url, options = {}, token = null, body = null) => {
    if (token) {
        if (token.auth_token)
            token = token.auth_token;

        if (!options.headers) options.headers = {};
        options.headers['Authorization'] = 'Bearer ' + token;
    }
    return jsonFetch(url, options, body);
}

export default fedicomFetch;