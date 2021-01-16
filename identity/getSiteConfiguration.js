const get = require('../libraries/support/methods').get;

async function getSiteConfiguration(domain, token) {
  const method = `/.well-known/openid-configuration`;

  try {
    console.time('getSiteConfiguration');
    const response = await get(domain, method, null, token);
    console.timeEnd('getSiteConfiguration');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getSiteConfiguration };