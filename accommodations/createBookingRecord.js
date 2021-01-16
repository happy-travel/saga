const post = require('../libraries/support/methods').post;

async function createBookingRecord(domain, token, availabilityId, testParameters, roomContractSetId, roomType, source) {
  let nationality = await testParameters.nationality();
  let residency = await testParameters.residency();
  const method = `/en/api/1.0/accommodations/bookings`;
  const params = {
    "availabilityId": availabilityId,
    "nationality": nationality,
    "paymentMethod": "BankTransfer",
    "residency": residency,
    "mainPassengerName": testParameters.passengers[0].firstName + ' ' + testParameters.passengers[0].lastName,
    "roomContractSetId": roomContractSetId,
    "roomDetails": [
      {
        "type": roomType,
        "passengers": testParameters.passengers
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