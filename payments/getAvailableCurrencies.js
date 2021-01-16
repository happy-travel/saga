const get = require('../libraries/support/methods').get;

async function getAvailableCurrencies(domain, token) {
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