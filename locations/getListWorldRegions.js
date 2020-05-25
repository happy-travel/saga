const get = require('../libraries/support/methods').get;
const getPaths = require('../libraries/support/vaultClient').getPaths;

async function getListWorldRegions(token) {
  const url = await getPaths();
  const domain = url.edo;
  const method = '/en/api/1.0/locations/regions';

  try {
    let start = new Date().getTime();
    const response = get(domain, method, null, token);
    let end = new Date().getTime();
    console.log(`getListWorldRegions: ${(end - start)/1000}sec`);
    return (response);
  } catch (error) {
    console.error(error.response);
  }
};

module.exports = { getListWorldRegions };