const get = require('../libraries/support/methods').get;

async function getUserInfo(domain, token) {
  const method = '/connect/userinfo';

  try {
    console.time('getUserInfo');
    const response = await get(domain, method, null, token);
    console.timeEnd('getUserInfo');
    return response;
  } catch (error) {
    console.error(error.response);
  }
}

module.exports = { getUserInfo };