const get = require('../libraries/support/methods').get;

async function getCurrentAgent(domain, token) {
  const method = '/en/api/1.0/agents';

  try {
    console.time('getCurrentAgent');
    const response = await get(domain, method, null, token);
    console.timeEnd('getCurrentAgent');
    return response;
  } catch (error) {
    console.error(error.response);
  }
};

module.exports = { getCurrentAgent };