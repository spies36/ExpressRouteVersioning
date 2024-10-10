import { RequestHandler } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core'


type RouteVersionFunctions<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Query,
    Locals extends Record<string, any> = any
> = { [version: string]: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> }


export {
    RouteVersionFunctions
}