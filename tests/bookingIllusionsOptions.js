import { getUserData, getPaths } from '../libraries/support/vaultClient';
import { getMonthFuture, getMonthAndWeekFuture } from '../libraries/support/getTime';
import { getUserToken } from '../libraries/support/getToken';
import { transfersMoneyFromCounterpartyToDefaultAgency } from '../payments/transferMoneyFromCounterpartyToDefaultAgency';
import { getAvailabilitySearchIdentifier } from '../accommodations/getAvailabilitySearchIdentifier';
import { getHotelDescription } from '../accommodations/getHotelDescription';
import { getAccommodationsAvailabilities } from '../accommodations/getAccommodationsAvailabilities';
import { getAvailableRoom } from '../accommodations/getAvailableRoom';
import { getRoomDetails } from '../accommodations/getRoomDetails';
import { getWorldCountries } from '../locations/getWorldCountries';
import { createBookingRecord } from '../accommodations/createBookingRecord';
import { payFromAccount } from '../payments/payFromAccount';
import { finalizeBooking } from '../accommodations/finalizeBooking';
import { returnAccountBalance } from '../payments/returnAccountBalance';

const faker = require('faker');
let userToken;
let edo;

beforeAll(async () => {
  let url = await getPaths();
  edo = url.edo;
  let tr = url.token;
  let user = await getUserData("master");
  userToken = await getUserToken(tr, user.login, user.password);
  let accountBalance = await returnAccountBalance(edo, userToken, "USD");
  if (accountBalance.data.balance <= 3000) {
    let admin = await getUserData("admin");
    let adminToken = await getUserToken(tr, admin.login, admin.password);
    await transfersMoneyFromCounterpartyToDefaultAgency(edo, adminToken, 10000, "USD");
    console.log('Account balance was replenished on 10000 USD');
  } else {
    console.log(`Current account balance of the ${user.login} user = ${accountBalance.data.balance}`)
  };
});

describe(`booking scenarios`, () => {

  test('Booking a room in Grand Hyatt Dubai per an adult', async () => {

    let countryObject = await getWorldCountries(edo, userToken, "saudi")
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "Grand Hyatt Dubai",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 1,
          "childrenNumber": 0
        }
      ],
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        }
      ]
    }

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data[0].data.accommodationDetails.id;

    let hotelDescription = await getHotelDescription(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId);

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
    expect(hotelDescription.data.id).toBe("32-4610");
    expect(hotelDescription.data.name).toBe("Grand Hyatt Dubai");
    expect(response.status).toBe(200);
  });

  test('Booking a room in Grand Hyatt Dubai per an adult and a child  (1 yr.)', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "Grand Hyatt Dubai",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 1,
          "childrenNumber": 1,
          "childrenAges": [
            1
          ]
        }
      ],
      passengers: [
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Ms",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 1
        }
      ],
    }

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data[0].data.accommodationDetails.id;

    let hotelDescription = await getHotelDescription(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId);

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
    expect(hotelDescription.data.id).toBe("32-4610");
    expect(hotelDescription.data.name).toBe("Grand Hyatt Dubai");
    expect(response.status).toBe(200);
  });

  test('Booking a room in Hilton Dubai the Walk per an adult and a child  (4 yrs.)', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "hilton dubai the walk",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 1,
          "childrenNumber": 1,
          "childrenAges": [
            4
          ]
        }
      ],
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 4
        }
      ]
    };

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data[0].data.accommodationDetails.id;

    let hotelDescription = await getHotelDescription(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId);

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
    expect(hotelDescription.data.id).toBe("32-4622");
    expect(hotelDescription.data.name).toBe("Hilton Dubai The Walk (Ex Jumeirah Residences)");
    expect(response.status).toBe(200);
  });

  test('Booking a room in Grand Hyatt Dubai per 2 adults', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "Grand Hyatt Dubai",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 2,
          "childrenNumber": 0
        }
      ],
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        }
      ],
    };

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data[0].data.accommodationDetails.id;

    let hotelDescription = await getHotelDescription(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId);

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
    expect(hotelDescription.data.id).toBe("32-4610");
    expect(hotelDescription.data.name).toBe("Grand Hyatt Dubai");
    expect(response.status).toBe(200);
  });

  test('Booking a room in Grand Hyatt Dubai per 2 adults and a child (3 yrs.)', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "Grand Hyatt Dubai",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 1,
          "childrenNumber": 1,
          "childrenAges": [
            3
          ]
        }
      ],
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Ms",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 3
        }
      ]  
    };
    
    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data[0].data.accommodationDetails.id;

    let hotelDescription = await getHotelDescription(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId);

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
    expect(hotelDescription.data.id).toBe("32-4610");
    expect(hotelDescription.data.name).toBe("Grand Hyatt Dubai");
    expect(response.status).toBe(200);
  });

  test('Booking a room in Ja Beach Hotel per 2 adults and a child (3 yrs.)', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "ja beach hotel",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 1,
          "childrenNumber": 1,
          "childrenAges": [
            3
          ]
        }
      ],
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Ms",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 3
        }
      ]
    };

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    console.log(accommodationsAvailabilities.data);
    if (accommodationsAvailabilities.data.length == 0) {
      console.log('No accommodations available');
      console.log(accommodationsAvailabilities.status);
      let response = accommodationsAvailabilities.status
      return response;
    } else {
      let secondSearchStepSource = accommodationsAvailabilities.data[0].source;
      let secondSearchStepAvailabilityId = accommodationsAvailabilities.data[0].data.availabilityId;
      let secondSearchStepAccommodationId = accommodationsAvailabilities.data[0].data.accommodationDetails.id;

      let hotelDescription = await getHotelDescription(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId);

      let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);

      let thirdSearchStepSource = availableRoom.data.source;
      let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
      let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

      let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);

      let chosedRoomDataSource = chosedRoomData.data.source;
      let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
      let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
      let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

      let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, nationality, residency, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, passengers, chosedRoomDataSource);
      console.log(booking.response.status);
      if (booking.response.status === 400) {
        console.log("Sorry, something is wrong. Hotel Not Available for Booking")
      } else {
        console.log("Go to next step")
      }

      let referenceCode = booking.data;

      await payFromAccount(edo, userToken, referenceCode);

      const response = await finalizeBooking(edo, userToken, referenceCode);

      console.log(`A booking was made with reference code: ${referenceCode}`)

      expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
      expect(hotelDescription.data.id).toBe("32-4632");
      expect(hotelDescription.data.name).toBe("Ja Beach Hotel");
    }

    expect(response.status).toBe(200);
  });

  test('Booking a room in Grand Hyatt Dubai per 2 adults and 2 children (1 yr. and 8 yrs.)', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "Grand Hyatt Dubai",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 2,
          "childrenNumber": 2,
          "childrenAges": [
            1,
            8
          ]
        }
      ],
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        },
        {
          "title": "Ms",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 1
        },
        {
          "title": "Miss",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 8
        }
      ]
    };

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data[0].data.accommodationDetails.id;

    let hotelDescription = await getHotelDescription(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId);

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
    expect(hotelDescription.data.id).toBe("32-4610");
    expect(hotelDescription.data.name).toBe("Grand Hyatt Dubai");
    expect(response.status).toBe(200);
  });

  test('Booking a room in Ja Beach Hotel per 2 adults and 2 children (5 yr. and 6 yrs.)', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "ja beach hotel",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 2,
          "childrenNumber": 2,
          "childrenAges": [
            5,
            6
          ]
        }
      ],
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        },
        {
          "title": "Ms",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 5
        },
        {
          "title": "Miss",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 6
        }
      ]
    };

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data[0].data.accommodationDetails.id;

    let hotelDescription = await getHotelDescription(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId);

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
    expect(hotelDescription.data.id).toBe("32-4632");
    expect(hotelDescription.data.name).toBe("Ja Beach Hotel");
    expect(response.status).toBe(200);
  });

  test('Booking a room in Grand Hyatt Dubai per 3 adults', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "Grand Hyatt Dubai",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 3,
          "childrenNumber": 0
        }
      ],
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        },
        {
          "title": "Ms",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        }
      ]
    };

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      console.log(checkInDate);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      console.log(checkOutDate);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data[0].data.accommodationDetails.id;

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
    expect(hotelDescription.data.name).toBe("Grand Hyatt Dubai");
    expect(response.status).toBe(200);
  });

  test('Booking a room in Grand Hyatt Dubai per 3 adults and 1 child (1 yr.)', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "Grand Hyatt Dubai",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 3,
          "childrenNumber": 1,
          "childrenAges": [
            1
          ]
        }
      ],  
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        },
        {
          "title": "Ms",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        },
        {
          "title": "Miss",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 1
        }
      ]
    };

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data.results[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data.results[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data.results[0].data.accommodationDetails.id;

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(response.status).toBe(200);
    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
  });

  test('Booking a room in Grand Hyatt Dubai per 5 adults', async () => {
    let countryObject = await getWorldCountries(edo, userToken, "saudi");
    let checkInDate = getMonthFuture(1, 0);
    let checkOutDate = getMonthAndWeekFuture(1, 7);

    const testParameters = {
      hotelName: "Grand Hyatt Dubai",
      nationality: async function () {
        let nationality = countryObject.data[0].code;
        return nationality;
      },
      residency: async function () {
        let residency = countryObject.data[0].code;
        return residency;
      },
      roomDetails: [
        {
          "adultsNumber": 5,
          "childrenNumber": 0
        }
      ],
      passengers: [
        {
          "title": "Mr",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33,
          "isLeader": true
        },
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        },
        {
          "title": "Ms",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        },
        {
          "title": "Mrs",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        },
        {
          "title": "Ms",
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "age": 33
        }
      ]
    };

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    if (accommodationsAvailabilities.data.length == 0) {
      let checkInDate = getMonthFuture(1, 5);
      console.log(checkInDate);
      let checkOutDate = getMonthAndWeekFuture(1, 7);
      console.log(checkOutDate);
      availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, checkInDate, checkOutDate, testParameters);
      searchId = availabilitySearch.data;
      accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    };
    let secondSearchStepSource = accommodationsAvailabilities.data.results[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data.results[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data.results[0].data.accommodationDetails.id;

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, testParameters, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)
    
    expect(accommodationsAvailabilities.data[0].source).toBe("Illusions");
    expect(hotelDescription.data.name).toBe("Grand Hyatt Dubai");
    expect(response.status).toBe(200);
  });

  test.skip('2 Rooms; 2 adults each', async () => {
    let nationalityObject = await getWorldCountries(edo, userToken, "saudi");
    let residencyObject = await getWorldCountries(edo, userToken, "saudi");
    let nationality = nationalityObject.data[0].code;
    let residency = residencyObject.data[0].code;

    const passengers = [
      {
        "title": "Mr",
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "age": 33,
        "isLeader": true
      },
      {
        "title": "Mrs",
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "age": 33
      },
      {
        "title": "Ms",
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "age": 33
      },
      {
        "title": "Mrs",
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "age": 33
      },
      {
        "title": "Ms",
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "age": 33
      }
    ];

    const roomDetails = [
      {
        "adultsNumber": 2,
        "childrenNumber": 0
      },
      {
        "adultsNumber": 2,
        "childrenNumber": 0
      }
    ];

    let availabilitySearch = await getAvailabilitySearchIdentifier(edo, userToken, "Grand Hyatt Dubai", roomDetails, nationality, residency);
    let searchId = availabilitySearch.data;

    let accommodationsAvailabilities = await getAccommodationsAvailabilities(edo, userToken, searchId);
    let secondSearchStepSource = accommodationsAvailabilities.data.results[0].source;
    let secondSearchStepAvailabilityId = accommodationsAvailabilities.data.results[0].data.availabilityId;
    let secondSearchStepAccommodationId = accommodationsAvailabilities.data.results[0].data.accommodationDetails.id;

    let availableRoom = await getAvailableRoom(edo, userToken, secondSearchStepSource, secondSearchStepAccommodationId, secondSearchStepAvailabilityId);
    let thirdSearchStepSource = availableRoom.data.source;
    let thirdSearchStepAvailabilityId = availableRoom.data.data.availabilityId;
    let thirdSearchStepRoomContractSetId = availableRoom.data.data.roomContractSets[0].id;

    let chosedRoomData = await getRoomDetails(edo, userToken, thirdSearchStepSource, thirdSearchStepAvailabilityId, thirdSearchStepRoomContractSetId);
    let chosedRoomDataSource = chosedRoomData.data.source;
    let chosedRoomDataAvailabilityId = chosedRoomData.data.data.availabilityId;
    let chosedRoomDataRoomContractSetId = chosedRoomData.data.data.roomContractSet.id;
    let chosedRoomDataRoomType = chosedRoomData.data.data.roomContractSet.roomContracts[0].type;

    let booking = await createBookingRecord(edo, userToken, chosedRoomDataAvailabilityId, nationality, residency, chosedRoomDataRoomContractSetId, chosedRoomDataRoomType, passengers, chosedRoomDataSource);
    let referenceCode = booking.data;

    await payFromAccount(edo, userToken, referenceCode);

    const response = await finalizeBooking(edo, userToken, referenceCode);

    console.log(`A booking was made with reference code: ${referenceCode}`)

    expect(response.status).toBe(200);
  });
});