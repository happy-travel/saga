const post = require('./methods').post;

async function getUserToken(name, password) {
  const domain = environment.tokenDev;
  const method = '/token';
  const params = {
    "userName": name,
    "password": password
  }

  try {
    const tokenData = await post(domain, method, params);
    return tokenData.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getUserToken };