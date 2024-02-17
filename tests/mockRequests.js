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


const requestWithMiddleSubVersion = { headers: {} };
requestWithMiddleSubVersion.headers['accept-version'] = '0.0.1'

const requestWithMiddleMinorVersion = { headers: {} };
requestWithMiddleMinorVersion.headers['accept-version'] = '0.2.0'

const requestWithMiddleMajorVersion = { headers: {} };
requestWithMiddleMajorVersion.headers['accept-version'] = '2.0.0'

const requestWithMiddleMajMinSubVersion = { headers: {} };
requestWithMiddleMajMinSubVersion.headers['accept-version'] = '1.0.0'

const requestWithNoMatchMajMinSubVersion = { headers: {} };
requestWithNoMatchMajMinSubVersion.headers['accept-version'] = '1.0.9';


const res = response
const nextFunc = next


module.exports = {
    requestWithNoVersion,
    requestWithHighestSubVersion,
    requestWithHighestMinorVersion,
    requestWithHighestMajorVersion,
    requestWithHighestMajMinSubVersion,
    requestWithMiddleMajMinSubVersion,
    requestWithMiddleMajorVersion,
    requestWithMiddleMinorVersion,
    requestWithMiddleSubVersion,
    requestWithNoMatchMajMinSubVersion,
    res,
    nextFunc
}