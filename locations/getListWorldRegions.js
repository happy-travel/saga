const get = require('../libraries/support/methods').get;
const path = require('../libraries/support/vaultClient').path;

async function getListWorldRegions(token) {
  const url = await path();
  const domain = url.edo;
  const method = '/en/api/1.0/locations/regions';

  try {
    const response = get(domain, method, null, token);
    return (response);
  } catch (error) {
    console.error(error.response);
  }
};

module.exports = { getListWorldRegions };