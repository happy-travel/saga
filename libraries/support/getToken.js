const post = require('./methods').post;

async function getUserToken(domain, login, password) {
  const method = '/token';
  const params = {
    "userName": login,
    "password": password
  }

  try {
    console.time('getUserToken');
    let tokenData = await post(domain, method, params);
    console.timeEnd('getUserToken');
    return tokenData.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getUserToken };