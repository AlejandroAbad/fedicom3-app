
const jsonFetch = async (url, options = {}, body = null) => {

    options.mode = 'cors';

    if (body) {
        options.body = JSON.stringify(body);
        if (options.headers)
            options.headers['Content-Type'] = 'application/json';
        else
            options.headers = { 'Content-Type': 'application/json' };
        if (!options.method) options.method = 'POST';
    }

    const r = await fetch(url, options);
    const data = await r.json();
    return ({
        ok: (r.status >= 200 && r.status < 300),
        status: r.status,
        body: data,
        headers: r.headers
    });
}

const fedicomFetch = (url, options = {}, token = null, body = null) => {
    if (!options.headers) options.headers = {};

    if (token) {
        if (token.auth_token)
            token = token.auth_token;
        options.headers['Authorization'] = 'Bearer ' + token;
    }
    options.headers['Software-ID'] = '9001';
    return jsonFetch(url, options, body);
}

export default fedicomFetch;