const get = require('../libraries/support/methods').get;

async function getWorldRegions(domain, token) {
  const method = '/en/api/1.0/locations/regions';

  try {
    console.time('getWorldRegions');
    const response = get(domain, method, null, token);
    console.timeEnd('getWorldRegions');
    return (response);
  } catch (error) {
    console.error(error.response);
  }
};

module.exports = { getWorldRegions };