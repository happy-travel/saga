const get = require('../libraries/support/methods').get;
const getPaths = require('../libraries/support/vaultClient').getPaths;

async function getAvailableCurrencies(token) {
  const url = await getPaths();
  const domain = url.edo;
  const method = '/en/api/1.0/payments/currencies';

  try {
    let start = new Date().getTime();
    const response = await get(domain, method, null, token);
    let end = new Date().getTime();
    console.log(`getAvailableCurrencies: ${(end - start) / 1000}sec`);
    return response;
  } catch (error) {
    console.error(error.response);
  }
};

module.exports = { getAvailableCurrencies };