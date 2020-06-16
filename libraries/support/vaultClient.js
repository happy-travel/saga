const vaultClient = require('@happy-travel/vault-client-js').VaultClient;
const vaultOptions = require('@happy-travel/vault-client-js').VaultOptions;

let baseUrl = process.env.HTDC_VAULT_ENDPOINT;
let engine = 'tests';
let role = 'saga';
let token = process.env.HTDC_VAULT_TOKEN;
let options = new vaultOptions(baseUrl, engine, role);
let client = new vaultClient(options);

async function getUserData(position) {
  await client.login(token);
  console.time('getUserData');
  let userData = await client.get(`users/${position}`);
  console.timeEnd('getUserData');
  return userData;
}

async function getPaths() {
  await client.login(token);
  console.time('getPaths');
  let urls = await client.get('urls');
  console.timeEnd('getPaths');
  return urls;
}

module.exports = { getUserData, getPaths };