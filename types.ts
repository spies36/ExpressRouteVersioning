import { Request, Response } from 'express';

type VersionedRequest = Request<unknown, unknown, unknown, unknown>


type VersionedResponse = Response<unknown, any>


type RouteVersionFunctions = { [version: string]: Function }


type authStuff = {
    authStuff: {
        user: string,
        favLanguage: 'javascript',
    }
}


export {
    VersionedRequest,
    VersionedResponse,
    authStuff,
    RouteVersionFunctions
}