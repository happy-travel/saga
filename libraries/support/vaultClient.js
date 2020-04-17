const vaultClient = require('@happy-travel/vault-client-js').VaultClient;
const vaultOptions = require('@happy-travel/vault-client-js').VaultOptions;

let baseUrl = process.env.HTDC_VAULT_ENDPOINT;
let engine = 'tests';
let role = 'saga';
let token = process.env.HTDC_VAULT_TOKEN;
let options = new vaultOptions(baseUrl, engine, role);
let client = new vaultClient(options);

async function userData(position) {
  await client.login(token);
  let user = await client.get(`users/${position}`);
  return user;
}

async function path() {
  await client.login(token);
  let url = await client.get('urls');
  return url;
}

module.exports = { userData, path };