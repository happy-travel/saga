const post = require('../libraries/support/methods').post;
const getMonthsFuture = require('../libraries/support/getTime').getMonthFuture;
const getMonthAndWeekFuture = require('../libraries/support/getTime').getMonthAndWeekFuture;
const getLocationData = require('../libraries/data/getLocationData').getLocationData;
const getWorldCountries = require('../locations/getListWorldCountries').getListWorldCountries;
const getPaths = require('../libraries/support/vaultClient').getPaths;

async function getAccommodationsAvailable(token, searchStringValue, roomDetails, guestNationality, guestResidency) {
  const location = await getLocationData(token, searchStringValue);
  const nationality = await getWorldCountries(token, guestNationality);
  const residency = await getWorldCountries(token, guestResidency);
  const checkInDate = getMonthsFuture();
  const checkOutDate = getMonthAndWeekFuture();
  const url = await getPaths();
  const domain = url.edo;
  const method = '/en/api/1.0/availabilities/accommodations';
  const params = {
    "filters": "Default",
    "checkInDate": `${checkInDate}T00:00:00Z`,
    "checkOutDate": `${checkOutDate}T00:00:00Z`,
    "roomDetails": roomDetails,
    "location": {
      "predictionResult": {
        "id": location.id,
        "sessionId": "33ac0405-6dbd-48d2-a8d8-5b27440d5b05", //anyone; it's doesn't matter
        "source": location.source,
        "type": location.type
      },
      "coordinates": {
        "latitude": 0,
        "longitude": 0
      },
      "distance": 0
    },
    "nationality": nationality.data[0].code,
    "residency": residency.data[0].code
  }

  try {
    let start = new Date().getTime();
    const response = await post(domain, method, params, token);
    let end = new Date().getTime();
    console.log(`getAccommodationsAvailable: ${(end - start)/1000}sec`);
    return response;
  } catch (error) {
    console.error(error.response);
  }
};

module.exports = { getAccommodationsAvailable };