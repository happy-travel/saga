const axios = require("axios");

function test_get(domain, method, params) {
    return params && axios.get(domain + method + params) || axios.get(domain + method);
};

function test_post(domain, method, params) {
    return axios.post(domain + method, params);
};

module.exports = { test_get, test_post };