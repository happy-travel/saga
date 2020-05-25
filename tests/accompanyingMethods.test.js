import { gatUserData, getPaths } from '../libraries/support/vaultClient';
import { getUserToken } from '../libraries/support/getToken';
import { getAvailableCurrencies } from '../payments/getAvailableCurrencies';
import { getListWorldRegions } from '../locations/getListWorldRegions';
import { getCurrentAgent } from '../agents/getCurrentAgent';
import { getUserInfo } from '../identity/getUserInfo';
import { getLocationDataPredictions } from '../locations/getLocationDataPredictions';
import { getListWorldCountries } from '../locations/getListWorldCountries';

let token;
let user;
let edo;
let identity;

beforeAll(async () => {
  let url = await getPaths();
  edo = url.edo;
  identity = url.identity;
  user = await gatUserData("master");
  token = await getUserToken(user.login, user.password);
});

describe.skip('accompanying methods', () => {
  test('GET ​/{culture}​/api​/{v}​/payments​/currencies', async () => {
    let start = new Date().getTime();

    const response = await getAvailableCurrencies(edo, token);

    expect(response.status).toBe(200);
    expect(response.data).toContain("NotSpecified");
    expect(response.data).toContain("USD");
    expect(response.data).toContain("EUR");
    expect(response.data).toContain("AED");
    expect(response.data).toContain("SAR");

    let end = new Date().getTime();
    console.log(`Test GET ​/{culture}​/api​/{v}​/payments​/currencies: ${(end - start) / 1000}sec`);
  });

  test('GET ​/{culture}​/api​/{v}​/locations​/regions', async () => {
    let start = new Date().getTime();

    const response = await getListWorldRegions(edo, token);

    expect(response.status).toBe(200);

    let end = new Date().getTime();
    console.log(`Test GET ​/{culture}​/api​/{v}​/locations​/regions: ${(end - start) / 1000}sec`);
  });

  test('GET ​/{culture}​/api​/{v}​/agents', async () => {
    let start = new Date().getTime();

    const response = await getCurrentAgent(edo, token);

    expect(response.status).toBe(200);
    expect(response.data.email).toContain(user.email);
    expect(response.data.lastName).toContain("User");
    expect(response.data.firstName).toContain("Cloud");
    expect(response.data.position).toContain("Master");

    let end = new Date().getTime();
    console.log(`Test GET ​/{culture}​/api​/{v}​/agents: ${(end - start) / 1000}sec`);
  });

  test('GET /connect/userinfo', async () => {
    let start = new Date().getTime();

    const response = await getUserInfo(identity, token);

    expect(response.status).toBe(200);
    expect(response.data.email).toContain(user.email);
    expect(response.data.email_verified).toBe(true);

    let end = new Date().getTime();
    console.log(`Test GET /connect/userinfo: ${(end - start) / 1000}sec`);
  });

  test('GET /{culture}/api/{v}/locations/predictions "Dubai"', async () => {
    let start = new Date().getTime();

    const response = await getLocationDataPredictions(edo, token, "Dubai");

    expect(response.status).toBe(200);

    let end = new Date().getTime();
    console.log(`Test GET /{culture}/api/{v}/locations/predictions: ${(end - start) / 1000}sec`);
  });

  test('GET ​/{culture}​/api​/{v}​/locations​/countries "saudi"', async () => {
    let start = new Date().getTime();

    const response = await getListWorldCountries(edo, token, "saudi");

    expect(response.status).toBe(200);
    expect(response.data[0].code).toBe("SA");
    expect(response.data[0].name).toBe("Saudi Arabia");

    let end = new Date().getTime();
    console.log(`Test GET ​/{culture}​/api​/{v}​/locations​/countries for Saudi: ${(end - start) / 1000}sec`);
  })

  test('GET ​/{culture}​/api​/{v}​/locations​/countries "russia"', async () => {
    let start = new Date().getTime();

    const response = await getListWorldCountries(edo, token, "russia");

    expect(response.status).toBe(200);
    expect(response.data[0].code).toBe("RU");
    expect(response.data[0].name).toBe("Russian Federation");

    let end = new Date().getTime();
    console.log(`Test GET ​/{culture}​/api​/{v}​/locations​/countries for Russia: ${(end - start) / 1000}sec`);
  })

})