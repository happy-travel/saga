const get = require('../libraries/support/methods').get;

async function getAvailableCurrencies(domain, token) {
  const method = `/en/api/1.0/payments/currencies`;

  try {
    console.time('getAvailableCurrencies');
    const response = await get(domain, method, null, token);
    console.timeEnd('getAvailableCurrencies');
    return response;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getAvailableCurrencies };