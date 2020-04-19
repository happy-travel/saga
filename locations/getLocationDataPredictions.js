const get = require('../libraries/support/methods').get;
const getPaths = require('../libraries/support/vaultClient').getPaths;

async function getLocationDataPredictions(token, searchStringValue) {
    const url = await getPaths();
    const domain = url.edo;
    const method = '/en/api/1.0/locations/predictions';
    const params = {
        "query": searchStringValue,
        "sessionId": "694417fb-fa2f-487c-a17f-7aa57b7150d8"
    }

    try {
        const response = await get(domain, method, params, token);
        return response;
    } catch (error) {
        console.error(error.response);
    }
}

async function getLocationObject(token, searchStringValue, fullName) {
    const response = await getLocationDataPredictions(token, searchStringValue);
    const array = response.data;
    return array.filter(function (item) {
        return Object.keys(item).some(function (key) {
            return item[key] === fullName
        })
    })
};

module.exports = { getLocationDataPredictions, getLocationObject };