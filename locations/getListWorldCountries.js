const get = require('../libraries/support/methods').get;
const getPaths = require('../libraries/support/vaultClient').getPaths;

async function getListWorldCountries(token, search) {
  const url = await getPaths();
  const domain = url.edo;
  const method = '/en/api/1.0/locations/countries';
  const params = {
    "query": search
  }

  try {
    const response = await get(domain, method, params, token);
    return response;
  } catch (error) {
    console.error(error.response);
  }
}

module.exports = { getListWorldCountries };