const post = require('../libraries/support/methods').post;

async function appendsMoneyToСounterpartyAccount(domain, token, amount, currency) {
  const method = `/en/api/1.0/admin/payments/counterparty-accounts/320/replenish`;
  const params = {
    "amount": amount,
    "currency": currency,
    "reason": "Replenishing account for autotesting purposes"
  }

  try {
    console.time('appendsMoneyToСounterpartyAccount');
    const response = await post(domain, method, params, token);
    console.timeEnd('appendsMoneyToСounterpartyAccount');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { appendsMoneyToСounterpartyAccount };
