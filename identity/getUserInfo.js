const get = require('../libraries/support/methods').get;
const path = require('../libraries/support/vaultClient').path;

async function getUserInfo(token) {
  const url = await path();
  const domain = url.identity;
  const method = '/connect/userinfo';

  try {
    const response = await get(domain, method, null, token);
    return response;
  } catch (error) {
    console.error(error.response);
  }
}

module.exports = { getUserInfo };