import { NextFunction } from 'express'
import { VersionedRequest, VersionedResponse } from './types'


/**
 * Version Format - {Major.Minor.Sub} (2.1.0)
 * 
 * **MUST be in ascending version order.**
 */
declare type RouteVersionFunctions = { [version: string]: Function }


declare function pickFunctionByVersion(req: VersionedRequest, res: VersionedResponse, next: NextFunction, args: RouteVersionFunctions): void

/**
 * Middleware 
 */
declare function routeVersionHandler(args: RouteVersionFunctions): typeof pickFunctionByVersion

export {
    routeVersionHandler
}