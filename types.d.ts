import { Request, Response, NextFunction } from 'express'

type VersionedRequest = Request<unknown, unknown, unknown, unknown>


type VersionedResponse = Response<unknown, any>

/**
 * Version Format - {Major.Minor.Sub} (2.1.0)
 * 
 * **MUST be in ascending version order.**
 */
declare type RouteVersionFunctions = { [version: string]: Function }



type pickFunctionByVersion = (req: VersionedRequest, res: VersionedResponse, next: NextFunction, args: RouteVersionFunctions) => Promise<Function>

/**
 * Anonymous function whhich binds RouteVersionFunctions with req, res, next
 */
type routeVersionHandlerType = (args: RouteVersionFunctions) => pickFunctionByVersion


/**
 * Middleware which returns the correct function to run
 */
declare function routeVersionHandler(args: RouteVersionFunctions): routeVersionHandlerType
export {
    routeVersionHandler,
    RouteVersionFunctions
}