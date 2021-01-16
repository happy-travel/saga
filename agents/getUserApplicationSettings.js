const get = require('../libraries/support/methods').get;

async function getUserApplicationSettings(domain, token) {
  const method = `/en/api/1.0/agents/settings/application`;

  try {
    console.time('getUserApplicationSettings');
    const response = await get(domain, method, null, token);
    console.timeEnd('getUserApplicationSettings');
    return response;
  } catch (error) {
    console.error(error.response);
  }
}

module.exports = { getUserApplicationSettings };