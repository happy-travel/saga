import { appendsMoneyToСounterpartyAccount } from '../payments/appendsMoneyToСounterpartyAccount';

const post = require('../libraries/support/methods').post;

async function transfersMoneyFromCounterpartyToDefaultAgency(domain, token, amount, currency) {
  await appendsMoneyToСounterpartyAccount(domain, token, amount, currency);
  const method = '/en/api/1.0/admin/payments/counterparty-accounts/320/transfer';
  const params = {
    "amount": amount,
    "currency": currency
  }

  try {
    console.time('transfersMoneyFromCounterpartyToDefaultAgency');
    const response = await post(domain, method, params, token);
    console.timeEnd('transfersMoneyFromCounterpartyToDefaultAgency');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { transfersMoneyFromCounterpartyToDefaultAgency };
