const post = require('../libraries/support/methods').post;

async function createBookingRecord(domain, token, availabilityId, nationality, residency, roomContractSetId, roomType, passengers, source) {
  const method = `/en/api/1.0/accommodations/bookings`;
  const params = {
    "availabilityId": availabilityId,
    "nationality": nationality,
    "paymentMethod": "BankTransfer",
    "residency": residency,
    "mainPassengerName": passengers[0].firstName + ' ' + passengers[0].lastName,
    "roomContractSetId": roomContractSetId,
    "roomDetails": [
      {
        "type": roomType,
        "passengers": passengers
      }
    ],
    "features": [],
    "itineraryNumber": "",
    "dataProvider": source
  }

  try {
    console.time('createBookingRecord');
    const response = await post(domain, method, params, token);
    console.timeEnd('createBookingRecord');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { createBookingRecord };