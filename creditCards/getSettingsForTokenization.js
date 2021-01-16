const get = require('../libraries/support/methods').get;

async function getSettingsForTokenization(domain, token) {
  const method = `/en/api/1.0/cards/settings`;

  try {
    console.time('getSettingsForTokenization');
    const response = await get(domain, method, null, token);
    console.timeEnd('getSettingsForTokenization');
    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getSettingsForTokenization };