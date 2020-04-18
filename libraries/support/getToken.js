import { post } from './methods';
import { getPaths } from './vaultClient';

async function getUserToken(login, password) {
  const url = await getPaths();
  const domain = url.token;
  const method = '/token';
  const params = {
    "userName": login,
    "password": password
  }

  try {
    const tokenData = await post(domain, method, params);
    return tokenData.data;
  } catch (error) {
    console.error(error.response);
  }
};

module.exports = { getUserToken };