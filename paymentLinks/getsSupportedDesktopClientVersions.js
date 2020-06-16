const get = require('../libraries/support/methods').get;

async function getsSupportedDesktopClientVersions(domain, token) {
  const method = `/en/api/1.0/versions`;

  try {
    console.time('getsSupportedDesktopClientVersions');
    const response = await get(domain, method, null, token);
    console.timeEnd(' getsSupportedDesktopClientVersions');
    return response;
  } catch (error) {
    console.error(error)
  }
}

module.exports = { getsSupportedDesktopClientVersions };