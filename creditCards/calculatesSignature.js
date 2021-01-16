const post = require('../libraries/support/methods').post;
const { uuid } = require('uuidv4');

async function calculatesSignature(domain, token, referenceCode, accessCode, merchantIdentifier) {
  const merchantReference = uuid();
  console.log(merchantReference);
  const method = `/en/api/1.0/cards/signatures`;
  const params = {
    "service_command": "TOKENIZATION",
    "merchant_reference": merchantReference,
    "language": "en",
    "return_url": `https://dev.happytravel.com/payment/result/${referenceCode}`,
    "access_code": accessCode,
    "merchant_identifier": merchantIdentifier,
    "device_fingerprint": "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"
  }

  try {
    console.time('calculatesSignature');
    const response = await post(domain, method, params, token);
    console.timeEnd('calculatesSignature');
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { calculatesSignature };