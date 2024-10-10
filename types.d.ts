import { RequestHandler } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core'

/**
 * Version Format - {Major.Minor.Sub} (2.1.0)
 * 
 * **MUST be in ascending version order.**
 */
type RouteVersionFunctions<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Query,
    Locals extends Record<string, any> = any
> = { [version: string]: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> }

/**
 * This function finds the correct versioned function and calls it with respect to Request, Response, NextFunction.
 */
type routeVersionHandlerType = (args: RouteVersionFunctions) => void | Promise<void>

/**
 * Middleware which returns the correct function to run
 */
declare function routeVersionHandler(args: RouteVersionFunctions): routeVersionHandlerType

export {
    routeVersionHandler,
    RouteVersionFunctions
}