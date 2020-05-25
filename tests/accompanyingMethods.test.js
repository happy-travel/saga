import { gatUserData } from '../libraries/support/vaultClient';
import { getUserToken } from '../libraries/support/getToken';
import { getAvailableCurrencies } from '../payments/getAvailableCurrencies';
import { getListWorldRegions } from '../locations/getListWorldRegions';
import { getCurrentAgent } from '../agents/getCurrentAgent';
import { getUserInfo } from '../identity/getUserInfo';
import { getLocationDataPredictions } from '../locations/getLocationDataPredictions';
import { getListWorldCountries } from '../locations/getListWorldCountries';

let token;
let user;

beforeAll(async () => {
  user = await gatUserData("master");
  token = await getUserToken(user.login, user.password);
});

describe('accompanying methods', () => {
  test('GET ​/{culture}​/api​/{v}​/payments​/currencies', async () => {
    let start = new Date().getTime();

    const response = await getAvailableCurrencies(token);

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

    const response = await getListWorldRegions(token);

    expect(response.status).toBe(200);

    let end = new Date().getTime();
    console.log(`Test GET ​/{culture}​/api​/{v}​/locations​/regions: ${(end - start) / 1000}sec`);
  });

  test('GET ​/{culture}​/api​/{v}​/agents', async () => {
    let start = new Date().getTime();

    const response = await getCurrentAgent(token);

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

    const response = await getUserInfo(token);

    expect(response.status).toBe(200);
    expect(response.data.email).toContain(user.email);
    expect(response.data.email_verified).toBe(true);

    let end = new Date().getTime();
    console.log(`Test GET /connect/userinfo: ${(end - start) / 1000}sec`);
  });

  test('GET /{culture}/api/{v}/locations/predictions', async () => {
    let start = new Date().getTime();

    const response = await getLocationDataPredictions(token, "Dubai");

    expect(response.status).toBe(200);

    let end = new Date().getTime();
    console.log(`Test GET /{culture}/api/{v}/locations/predictions: ${(end - start) / 1000}sec`);
  });

  test('GET ​/{culture}​/api​/{v}​/locations​/countries', async () => {
    let start = new Date().getTime();

    const response = await getListWorldCountries(token, "saudi");

    expect(response.status).toBe(200);
    expect(response.data[0].code).toBe("SA");
    expect(response.data[0].name).toBe("Saudi Arabia");

    let end = new Date().getTime();
    console.log(`Test GET ​/{culture}​/api​/{v}​/locations​/countries for Saudi: ${(end - start) / 1000}sec`);
  })

  test('GET ​/{culture}​/api​/{v}​/locations​/countries', async () => {
    let start = new Date().getTime();

    const response = await getListWorldCountries(token, "russia");

    expect(response.status).toBe(200);
    expect(response.data[0].code).toBe("RU");
    expect(response.data[0].name).toBe("Russian Federation");

    let end = new Date().getTime();
    console.log(`Test GET ​/{culture}​/api​/{v}​/locations​/countries for Russia: ${(end - start) / 1000}sec`);
  })

})