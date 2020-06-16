const post = require('../libraries/support/methods').post;

async function getAvailableRoom(domain, token, source, accommodationId, availabilityId) {
  const method = `/en/api/1.0/${source}/accommodations/${accommodationId}/availabilities/${availabilityId}`;
  const params = {
    "source": source,
    "accommodationId": accommodationId,
    "availabilityId": availabilityId
  }

  try {
    console.time('getAvailableRoom');
    const response = await post(domain, method, params, token);
    console.timeEnd('getAvailableRoom');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getAvailableRoom };