import test from 'ava';
import config from '../config';
import { test_get, test_post } from "../methods";

let hotelId = '';
let availabilityId = '';
let tariffCode = '';
let agreement = '';
let roomType = '';

test.serial(`Returns hotels available for a booking`, async t => {
    const method = `/api/${config.api_version}/hotels/availability`;
    const params = {
        "nationality": "ru",
        "checkInDate": "2019-08-11T00:00:00Z",
        "checkOutDate": "2019-08-13T00:00:00Z",
        "roomDetails": [
            {
                "adultsNumber": 1,
                "childrenAges": [],
                "childrenNumber": 0,
                "isCotNeeded": false,
                "isExtraBedNeeded": false,
                "type": "NotSpecified"
            }
        ],
        "hotelIds": [],
        "filters": "Default",
        "location": {
            "distance": 61047,
            "coordinates": {
                "longitude": 0,
                "latitude": 0
            },
            "country": "The United Kingdom",
            "locality": "London",
            "name": "London",
            "type": "location"
        },
        "ratings": 0
    }
    const response = await test_post(config.domain, method, params);

    try {
        t.is(response.status, 200);
        hotelId = response.data.results[0].hotelDetails.id;
        availabilityId = response.data.availabilityId;
        tariffCode = response.data.results[0].agreements[0].tariffCode;
        agreement = response.data.results[0].agreements[0].id;
        roomType = response.data.results[0].agreements[0].rooms[0].type;
    } catch (error) {
        console.error(`POST ${config.domain}/api/${config.api_version}/hotels/availability`, error);
    }
});

test.serial(`Returns full hotel details`, async t => {
    const method = `/api/${config.api_version}/hotels/${hotelId}`;
    const response = await test_get(config.domain, method);

    try {
        t.is(response.status, 200);
    } catch (error) {
        console.error(`GET ${config.domain}/api/1.0/hotels/${hotelId}`, error.response.status, error.response.statusText);
    }
});

test.serial(`Returns deadline information for a booking`, async t => {
    const method = `/api/${config.api_version}/hotels/${hotelId}/deadline/${availabilityId}/${tariffCode}`;
    const response = await test_get(config.domain, method);

    try {
        t.is(response.status, 200);
    } catch (error) {
        console.error(`GET ${config.domain}/api/${config.api_version}/hotels/${hotelId}/deadline/${availabilityId}/${tariffCode}`, error.response.status, error.response.statusText);
    }
});

test.serial.skip(`Executes booking procedure`, async t => {
    const method = `/api/${config.api_version}/hotels/booking`;
    const params = {
        "searchNumber": availabilityId,
        "nationality": "ru",
        "checkinDate": "2019-08-21T11:58:00.984Z",
        "checkoutDate": "2019-09-21T11:58:00.984Z",
        "cityCode": "LON",
        "availableOnly": true,
        "hotelId": hotelId,
        "agreement": agreement,
        "referenceCode": "vvnf-kjnk53nn-jk546n",
        "responses": [],
        "roomDetails": [
            {
                "passengers": [
                    {
                        "title": "MR",
                        "surname": "Sychev",
                        "isLeader": true,
                        "name": "Denis",
                        "initial": "DVS",
                        "age": 35
                    }
                ],
                "type": roomType,
                "isExtraBedNeeded": true,
                "isCotNeededNeeded": true
            }
        ],
        "remarks": []
    }
    const response = await test_post(config.domain, method, params);

    try {
        t.is(response.status, 200);
    } catch (error) {
        console.error(`POST /api/${config.api_version}/hotels/booking`, response.response);
    }
});

test.serial.skip(`Returns existing booking details`, async t => {
    const method = `/api/${config.api_version}/hotels/booking/{referenceCode}`;
    const response = await test_get(config.domain, method);

    try {
        t.is(response.status, 200);
    } catch (error) {
        console.error(`GET /api/${config.api_version}/hotels/booking/{referenceCode}`, error.response.status, error.response.statusText);
    }
});