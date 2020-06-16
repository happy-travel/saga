const post = require('../libraries/support/methods').post;

async function appendsMoneyToAccount(domain, token, amount, currency) {
  const method = `/en/api/1.0/payments/7/replenish`;
  const params = {
    "amount": amount,
    "currency": currency,
    "reason": "Appends money to specified account"
  }

  try {
    console.time('appendsMoneyToAccount');
    const response = await post(domain, method, params, token);
    console.timeEnd('appendsMoneyToAccount');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { appendsMoneyToAccount };