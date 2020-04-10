const axios = require('./node_modules/axios');

function setToken(headers, token) {
    if (token) {
        if (!headers) {
            headers = {};
        }
        headers['Authorization'] = 'Bearer ' + token;
    }
    return headers;
};

function get(domain, method, params, token, headers) {
    if (!headers && !token) {
        return params && axios.get(domain + method, { params: params }) || axios.get(domain + method);
    }

    headers = setToken(headers, token);
    return params && axios.get(domain + method, { params: params, headers: headers }) || axios.get(domain + method, { headers: headers });
};

function post(domain, method, params, token, headers) {
    if (!headers && !token) {
        return axios.post(domain + method, params);
    }

    headers = setToken(headers, token);
    return axios.post(domain + method, params, { headers: headers });
};

module.exports = { get, post };