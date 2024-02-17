const { response, next } = require('express');


const requestWithNoVersion = { headers: {} }
requestWithNoVersion.originalUrl = 'google.com'

const requestWithHighestSubVersion = { headers: {} };
requestWithHighestSubVersion.headers['accept-version'] = '0.0.2'

const requestWithHighestMinorVersion = { headers: {} };
requestWithHighestMinorVersion.headers['accept-version'] = '0.3.0'

const requestWithHighestMajorVersion = { headers: {} };
requestWithHighestMajorVersion.headers['accept-version'] = '3.0.0'

const requestWithHighestMajMinSubVersion = { headers: {} };
requestWithHighestMajMinSubVersion.headers['accept-version'] = '1.1.1'

const res = response
const nextFunc = next


module.exports = {
    requestWithNoVersion,
    requestWithHighestSubVersion,
    requestWithHighestMinorVersion,
    requestWithHighestMajorVersion,
    requestWithHighestMajMinSubVersion,
    res,
    nextFunc
}