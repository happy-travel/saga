import { getUserData, getPaths } from '../libraries/support/vaultClient';
import { getUserToken } from '../libraries/support/getToken';
import { getAvailableCurrencies } from '../payments/getAvailableCurrencies';
import { getSiteConfiguration } from '../identity/getSiteConfiguration';
import { getUserInfo } from '../identity/getUserInfo';
import { getCurrentAgent } from '../agents/getCurrentAgent';
import { getUserApplicationSettings } from '../agents/getUserApplicationSettings';
import { getWorldRegions } from '../locations/getWorldRegions';
import { getsSupportedDesktopClientVersions } from '../paymentLinks/getsSupportedDesktopClientVersions';

let edo;
let user;
let userToken;
let identity;

beforeAll(async () => {
  let url = await getPaths();
  edo = url.edo;
  identity = url.identity;
  let tr = url.token;
  user = await getUserData("master");
  userToken = await getUserToken(tr, user.login, user.password);
});

describe('accompanying methods', () => {
  test('openid-configuration', async () => {
    const response = await getSiteConfiguration(identity, userToken);
    
    expect(response.status).toBe(200);
  });

  test('get user info', async () => {
    const response = await getUserInfo(identity, userToken);
    
    expect(response.status).toBe(200);
    expect(response.data.email).toBe(user.email);
    expect(response.data.email_verified).toBe(true);
  });

  test('get current agent', async () => {
    const response = await getCurrentAgent(edo, userToken);

    expect(response.status).toBe(200);
    expect(response.data.email).toBe(user.email);
  });

  test('get user application settings', async () => {
    const response = await getUserApplicationSettings(edo, userToken);
    
    expect(response.status).toBe(200);
  });

  test('get a list of world regions', async () => {
    const response = await getWorldRegions(edo, userToken);
    
    expect(response.status).toBe(200);
  });

  test('get available currencies', async () => {
    const response = await getAvailableCurrencies(edo, userToken);

    expect(response.status).toBe(200);
  });

  test('Gets supported desktop client versions', async () => {
    const response = await getsSupportedDesktopClientVersions(edo, userToken);

    expect(response.status).toBe(200);
  })
});