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
    let start = new Date().getTime();
    const tokenData = await post(domain, method, params);
    let end = new Date().getTime();
    console.log(`getUserToken: ${(end - start)/1000}sec`);
    return tokenData.data;
  } catch (error) {
    console.error(error.response);
  }
};

module.exports = { getUserToken };