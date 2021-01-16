const post = require('../libraries/support/methods').post;

async function finalizeBooking(domain, token, referenceCode) {
  const method = `/en/api/1.0/accommodations/bookings/${referenceCode}/finalize`;
  const params = {}

  try {
    console.time('finalizeBooking');
    const response = await post(domain, method, params, token);
    console.timeEnd('finalizeBooking');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { finalizeBooking };