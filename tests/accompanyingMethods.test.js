import { userData } from '../libraries/support/vaultClient';
import { getUserToken } from '../libraries/support/getToken';
import { getAvailableCurrencies } from '../payments/getAvailableCurrencies';
import { getListWorldRegions } from '../locations/getListWorldRegions';
import { getCurrentAgent } from '../agents/getCurrentAgent';
import { getUserInfo } from '../identity/getUserInfo';
import { getLocationPredictionsSearching } from '../locations/getLocationPredictionsSearching';
import { getListWorldCountries } from '../locations/getListWorldCountries';

describe('accompanying methods', () => {
  test('GET ​/{culture}​/api​/{v}​/payments​/currencies', async () => {
    const user = await userData("master");
    const token = await getUserToken(user.login, user.password);
    const response = await getAvailableCurrencies(token);

    expect(response.status).toBe(200);
    expect(response.data).toContain("NotSpecified");
    expect(response.data).toContain("USD");
    expect(response.data).toContain("EUR");
    expect(response.data).toContain("AED");
    expect(response.data).toContain("SAR");
  });

  test('GET ​/{culture}​/api​/{v}​/locations​/region', async () => {
    const user = await userData("master");
    const token = await getUserToken(user.login, user.password);
    const response = await getListWorldRegions(token);

    expect(response.status).toBe(200);
  });

  test('GET ​/{culture}​/api​/{v}​/agents', async () => {
    const user = await userData("master");
    const token = await getUserToken(user.login, user.password);
    const response = await getCurrentAgent(token);

    expect(response.status).toBe(200);
    expect(response.data.email).toContain(user.email);
    expect(response.data.lastName).toContain("User");
    expect(response.data.firstName).toContain("Cloud");
    expect(response.data.position).toContain("Master");
  });

  test('GET /connect/userinfo', async () => {
    const user = await userData("master");
    const token = await getUserToken(user.login, user.password);
    const response = await getUserInfo(token);

    expect(response.status).toBe(200);
    expect(response.data.email).toContain(user.email);
    expect(response.data.email_verified).toBe(true);
  });

  test('GET /{culture}/api/{v}/locations/predictions', async () => {
    const user = await userData("master");
    const token = await getUserToken(user.login, user.password);
    const response = await getLocationPredictionsSearching(token, "Dubai");

    expect(response.status).toBe(200);
  });

  test('GET ​/{culture}​/api​/{v}​/locations​/countries', async () => {
    const user = await userData("master");
    const token = await getUserToken(user.login, user.password);
    const response = await getListWorldCountries(token, "saudi");

    expect(response.status).toBe(200);
    expect(response.data[0].code).toBe("SA");
    expect(response.data[0].name).toBe("Saudi Arabia");
  })

  test('GET ​/{culture}​/api​/{v}​/locations​/countries', async () => {
    const user = await userData("master");
    const token = await getUserToken(user.login, user.password);
    const response = await getListWorldCountries(token, "russia");

    expect(response.status).toBe(200);
    expect(response.data[0].code).toBe("RU");
    expect(response.data[0].name).toBe("Russian Federation");
  })

})