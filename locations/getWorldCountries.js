const get = require('../libraries/support/methods').get;

async function getWorldCountries(domain, token, search) {
  const method = '/en/api/1.0/locations/countries';
  const params = {
    "query": search
  }

  try {
    console.time('getWorldCountries');
    const response = await get(domain, method, params, token);
    console.timeEnd('getWorldCountries');
    return response;
  } catch (error) {
    console.error(error.response);
  }
}

module.exports = { getWorldCountries };