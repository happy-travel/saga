const get = require('../libraries/support/methods').get;

async function getAccommodationsAvailabilities(domain, token, searchId) {
  const method = `/en/api/1.0/availabilities/accommodations/searches/${searchId}?top=10&skip=0`
  
  try {
    console.time('getAccommodationsAvailabilities');
    const response = await get(domain, method, null, token);
    console.timeEnd('getAccommodationsAvailabilities');
    return response;
  } catch (error) {
    console.error(error.response);
  }
}

module.exports = { getAccommodationsAvailabilities };