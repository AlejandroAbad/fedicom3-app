
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



export const fedicomFetchPdf = async (url, ref, options = {}, token = null, body = null) => {
    if (!options.headers) options.headers = {
        accept: 'application/pdf'
    };

    if (token) {
        if (token.auth_token)
            token = token.auth_token;
        options.headers['Authorization'] = 'Bearer ' + token;
    }
    options.headers['Software-ID'] = '9001';
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
    const blob = await r.blob();
    const base64 = await convertBlobToBase64(blob)

    if (r.status >= 200 && r.status < 300) {
        const href = window.URL.createObjectURL(blob);
        const a = ref.current;
        a.download = options.fileName || 'file';
        a.href = href;
        a.click();
        a.href = '';

        return ({
            ok: (r.status >= 200 && r.status < 300),
            status: r.status,
            body: base64,
            headers: r.headers
        });

    }


    return ({
        ok: (r.status >= 200 && r.status < 300),
        status: r.status,
        body: blob,
        headers: r.headers
    });
}


export const convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});

export default fedicomFetch;