const get = require('../libraries/support/methods').get;

async function returnAccountBalance(domain, token, currency) {
  const method = `/en/api/1.0/payments/accounts/balance/${currency}`;
  
  try {
    console.time('returnAccountBalance');
    const response = await get(domain, method, null, token);
    console.timeEnd('returnAccountBalance')
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { returnAccountBalance };