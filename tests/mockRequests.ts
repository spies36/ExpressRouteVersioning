import { response, NextFunction, Request } from 'express';
import { VersionedRequest } from '../types'

function buildRequest(headers: Record<string, string>) {
    return {
        body: {},
        headers: headers
    } as VersionedRequest
}

export const requestWithNoVersion = buildRequest({});
requestWithNoVersion.originalUrl = 'google.com';

export const requestWithHighestSubVersion = buildRequest({ 'accept-version': '0.0.2' });

export const requestWithHighestMinorVersion = buildRequest({ 'accept-version': '0.3.0' });

export const requestWithHighestMajorVersion = buildRequest({ 'accept-version': '3.0.0' });

export const requestWithHighestMajMinSubVersion = buildRequest({ 'accept-version': '1.1.1' });

export const requestWithMiddleSubVersion = buildRequest({ 'accept-version': '0.0.1' });

export const requestWithMiddleMinorVersion = buildRequest({ 'accept-version': '0.2.0' });

export const requestWithMiddleMajorVersion = buildRequest({ 'accept-version': '2.0.0' });

export const requestWithMiddleMajMinSubVersion = buildRequest({ 'accept-version': '1.0.0' });

export const requestWithNoMatchMajMinSubVersion = buildRequest({ 'accept-version': '1.0.9' });

export const res = response
export const nextFunc: NextFunction = () => { };