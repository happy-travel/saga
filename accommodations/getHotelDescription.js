const get = require('../libraries/support/methods').get;

async function getHotelDescription(domain, token, source, accommodationId) {
  const method = `/en/api/1.0/${source}/accommodations/${accommodationId}`

  try {
    console.time('getHotelDescription');
    const response = await get(domain, method, null, token);
    console.timeEnd('getHotelDescription');
    return (response);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getHotelDescription };
