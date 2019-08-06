import test from 'ava';
import config from '../config';
import { test_post } from "../methods";

test.skip(`Get transfer availability`, async t => {
    const method = `/api/${config.api_version}/transfers/availability`;
    const params = {
        "startPointIds": [],
        "endPointIds": [],
        "startCityCode": "LON",
        "endCityCode": "LON",
        "date": "2019-08-21T11:58:00.984Z",
        "passengerCount": 1,
        "baggageCount": 1
    }
    const response = await test_post(config.domain, method, params);

    try {
        t.is(response.data.status, 400);
        console.log(error.response);
    } catch (error) {
        console.log(error.response);
    }
});