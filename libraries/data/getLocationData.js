const getLocationObject = require('../../locations/getLocationDataPredictions').getLocationObject;

async function getLocationData(domain, token, searchStringValue) {
    if (searchStringValue === "Vienna") {
        const fullName = "Vienna, Austria";
        const searchObject = await getLocationObject(domain, token, searchStringValue, fullName);
        const id = searchObject[0].id;
        const type = searchObject[0].type;
        const source = searchObject[0].source;
        return {
            fullName,
            id,
            type,
            source
        }
    }
    if (searchStringValue === "Dubai") {
        const fullName = "Dubai, The United Arab Emirates";
        const searchObject = await getLocationObject(domain, token, searchStringValue, fullName);
        const id = searchObject[0].id;
        const type = searchObject[0].type;
        const source = searchObject[0].source;
        return {
            fullName,
            id,
            type,
            source
        }
    }
    if (searchStringValue === "Venice") {
        const fullName = "Venice, Italy";
        const searchObject = await getLocationObject(domain, token, searchStringValue, fullName);
        const id = searchObject[0].id;
        const type = searchObject[0].type;
        const source = searchObject[0].source;
        return {
            fullName,
            id,
            type,
            source
        }
    }
    if (searchStringValue === "Conrad Dubai Hotel") {
        const fullName = "Conrad Dubai Hotel, Dubai, The United Arab Emirates";
        const searchObject = await getLocationObject(domain, token, searchStringValue, fullName);
        const id = searchObject[0].id;
        const type = searchObject[0].type;
        const source = searchObject[0].source;
        return {
            fullName,
            id,
            type,
            source
        }
    }
    if (searchStringValue === "Splendid Venice") {
        const fullName = "Splendid Venice - Starhotels Collezione, Venice, Italy";
        const searchObject = await getLocationObject(domain, token, searchStringValue, fullName);
        const id = searchObject[0].id;
        const type = searchObject[0].type;
        const source = searchObject[0].source;
        return {
            fullName,
            id,
            type,
            source
        }
    }
    if (searchStringValue === "Grand Hyatt Dubai") {
        const fullName = "Grand Hyatt Dubai, Dubai, The United Arab Emirates";
        const searchObject = await getLocationObject(domain, token, searchStringValue, fullName);
        const id = '652e3fafe8884a33a5f10827b192be21';
        const type = searchObject[0].type;
        const source = searchObject[0].source;
        return {
            fullName,
            id,
            type,
            source
        }
    }
    if (searchStringValue === "hilton dubai the walk") {
        const fullName = "Hilton Dubai The Walk (Ex Jumeirah Residences), Dubai, The United Arab Emirates";
        const searchObject = await getLocationObject(domain, token, searchStringValue, fullName);
        const id = '290fbb1a6d3642e3890007d0b8d62176';
        const type = searchObject[0].type;
        const source = searchObject[0].source;
        return {
            fullName,
            id,
            type,
            source
        }
    }
    if (searchStringValue === "ja beach hotel") {
        const fullName = "Ja Beach Hotel, Dubai, The United Arab Emirates";
        const searchObject = await getLocationObject(domain, token, searchStringValue, fullName);
        const id = '6a0a677c845c404ba18cbeb274f799fc';
        const type = searchObject[0].type;
        const source = searchObject[0].source;
        return {
            fullName,
            id,
            type,
            source
        }
    }
}

module.exports = { getLocationData };