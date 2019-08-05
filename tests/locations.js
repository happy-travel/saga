import test from 'ava';
import config from '../config';
import { test_get } from "../methods";

test(`Get all locations`, async t => {
    const method = `/api/${config.api_version}/locations`;
    const response = await test_get(config.domain, method);

    try {
        t.is(response.status, 200)
    } catch (error) {
        console.error(`GET /api/${config.api_version}/locations`, error.response.status, error.response.statusText);
    }
});