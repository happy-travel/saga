const axios = require('axios');

function setToken(headers, token) {
    if (token)
    {
        if (!headers) {
            headers = {};
        }
        headers['Authorization'] = 'Bearer ' + token;
    }
    return headers;
};

function test_get(domain, method, params, token, headers) {    
    if (!headers && !token) {
        return params && axios.get(domain + method, { params: params }) || axios.get(domain + method);
    }
    
    headers = setToken(headers, token);
    return params && axios.get(domain + method, { params: params, headers: headers }) || axios.get(domain + method, { headers: headers });
};

function test_post(domain, method, params, token, headers) {
    if (!headers && !token) {
        return axios.post(domain + method, params);
    }
    
    headers = setToken(headers, token);
    return axios.post(domain + method, params, { headers: headers });
};

module.exports = { test_get, test_post };