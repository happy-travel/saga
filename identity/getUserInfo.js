const get = require('../libraries/support/methods').get;
const getPaths = require('../libraries/support/vaultClient').getPaths;

async function getUserInfo(token) {
  const url = await getPaths();
  const domain = url.identity;
  const method = '/connect/userinfo';

  try {
    let start = new Date().getTime();
    const response = await get(domain, method, null, token);
    let end = new Date().getTime();
    console.log(`getUserInfo: ${(end - start)/1000}sec`);
    return response;
  } catch (error) {
    console.error(error.response);
  }
}

module.exports = { getUserInfo };