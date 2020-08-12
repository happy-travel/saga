const post = require('../libraries/support/methods').post;
const getLocationData = require('../libraries/data/getLocationData').getLocationData;

async function getAvailabilitySearchIdentifier(domain, token, checkInDate, checkOutDate, testParameters) {
  const location = await getLocationData(domain, token, testParameters.hotelName);
  let guestNationality = await testParameters.nationality();
  let guestResidency = await testParameters.residency();
  const method = '/en/api/1.0/availabilities/accommodations/searches';
  const params = {
    "filters": "Default",
    "checkInDate": `${checkInDate}T00:00:00Z`,
    "checkOutDate": `${checkOutDate}T00:00:00Z`,
    "roomDetails": testParameters.roomDetails,
    "location": {
      "predictionResult": {
        "id": location.id,
        "sessionId": "76f75648-3bc5-4661-b907-8537fb512186", //anyone; it's doesn't matter
        "source": location.source,
        "type": location.type
      },
      "coordinates": {
        "latitude": 0,
        "longitude": 0
      },
      "distance": 0
    },
    "nationality": guestNationality,
    "residency": guestResidency
  }

  try {
    console.time('getAvailabilitySearchIdentifier');
    const response = await post(domain, method, params, token);
    console.timeEnd('getAvailabilitySearchIdentifier');
    return response;
  } catch (error) {
    console.error(error.response);
  }
};

module.exports = { getAvailabilitySearchIdentifier };