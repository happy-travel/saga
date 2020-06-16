const post = require('../libraries/support/methods').post;

async function payFromAccount(domain, token, referenceCode) {
  const method = `/en/api/1.0/payments/bookings/account`;
  const params = {
    "referenceCode": referenceCode
  }

  try {
    console.time('payFromAccount');
    const response = await post(domain, method, params, token);
    console.timeEnd('payFromAccount');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { payFromAccount };