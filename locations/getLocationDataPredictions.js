const get = require('../libraries/support/methods').get;

async function getLocationDataPredictions(domain, token, searchStringValue) {
    const method = '/en/api/1.0/locations/predictions';
    const params = {
        "query": searchStringValue,
        "sessionId": "76f75648-3bc5-4661-b907-8537fb512186"
    }

    try {
        console.time('getLocationDataPredictions');
        const response = await get(domain, method, params, token);
        console.timeEnd('getLocationDataPredictions');
        return response;
    } catch (error) {
        console.error(error.response);
    }
}

async function getLocationObject(domain, token, searchStringValue, fullName) {
    const response = await getLocationDataPredictions(domain, token, searchStringValue);
    const array = response.data;
    return array.filter(function (item) {
        return Object.keys(item).some(function (key) {
            return item[key] === fullName
        })
    })
};

module.exports = { getLocationDataPredictions, getLocationObject };