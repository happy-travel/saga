const vaultClient = require('@happy-travel/vault-client-js').VaultClient;
const vaultOptions = require('@happy-travel/vault-client-js').VaultOptions;

let baseUrl = process.env.HTDC_VAULT_ENDPOINT;
let engine = 'tests';
let role = 'saga';
let token = process.env.HTDC_VAULT_TOKEN;
let options = new vaultOptions(baseUrl, engine, role);
let client = new vaultClient(options);

async function gatUserData(position) {
  await client.login(token);
  let userData = await client.get(`users/${position}`);
  return userData;
}

async function getPaths() {
  await client.login(token);
  let urls = await client.get('urls');
  return urls;
}

module.exports = { gatUserData, getPaths };