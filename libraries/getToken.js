const test_post = require('./methods').test_post;
const environment = require('../environment').environment

async function getUserToken(name, password) {
  const domain = environment.tokenDev;
  const method = '/token';
  const params = {
    "userName": name,
    "password": password
  }

  try {
    const tokenData = await test_post(domain, method, params);
    return tokenData.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getUserToken };