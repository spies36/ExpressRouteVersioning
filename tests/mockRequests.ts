import { response, NextFunction, Request } from 'express';
import { VersionedRequest } from '../types'

const defaultRequest = {
    body: {},
    headers: {}
} as Request

function buildRequest() {
    return {
        body: {},
        headers: {}
    } as VersionedRequest
}

export const requestWithNoVersion = buildRequest();
requestWithNoVersion.originalUrl = 'google.com';

export const requestWithHighestSubVersion = buildRequest();
requestWithHighestSubVersion.headers['accept-version'] = '0.0.2';

export const requestWithHighestMinorVersion = buildRequest();
requestWithHighestMinorVersion.headers['accept-version'] = '0.3.0';

export const requestWithHighestMajorVersion = buildRequest();
requestWithHighestMajorVersion.headers['accept-version'] = '3.0.0';

export const requestWithHighestMajMinSubVersion = buildRequest();
requestWithHighestMajMinSubVersion.headers['accept-version'] = '1.1.1';


export const requestWithMiddleSubVersion = buildRequest();
requestWithMiddleSubVersion.headers['accept-version'] = '0.0.1';

export const requestWithMiddleMinorVersion = buildRequest();
requestWithMiddleMinorVersion.headers['accept-version'] = '0.2.0';

export const requestWithMiddleMajorVersion = buildRequest();
requestWithMiddleMajorVersion.headers['accept-version'] = '2.0.0'

export const requestWithMiddleMajMinSubVersion = buildRequest();
requestWithMiddleMajMinSubVersion.headers['accept-version'] = '1.0.0'

export const requestWithNoMatchMajMinSubVersion = buildRequest();
requestWithNoMatchMajMinSubVersion.headers['accept-version'] = '1.0.9'

export const res = response
export const nextFunc: NextFunction = () => { };