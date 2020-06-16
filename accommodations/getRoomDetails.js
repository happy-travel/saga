const post = require('../libraries/support/methods').post;

async function getRoomDetails(domain, token, source, availabilityId, roomContractSetId) {
  const method = `/en/api/1.0/${source}/accommodations/availabilities/${availabilityId}/room-contract-sets/${roomContractSetId}`;
  const params = {
    "source": source,
    "availabilityId": availabilityId,
    "roomContractSetId": roomContractSetId
  }

  try {
    console.time('getRoomDetails');
    const response = await post(domain, method, params, token);
    console.timeEnd('getRoomDetails');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getRoomDetails };