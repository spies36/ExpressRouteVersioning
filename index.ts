import { Request, Response, NextFunction } from 'express';
import { RouteVersionFunctions, } from './types'

/**
 * Find the highest function version
 */
function getLatestFunctionVersion(args: RouteVersionFunctions) {
    let versions = Object.keys(args);
    if (versions.length === 0) {
        return null
    }

    return args[versions[versions.length - 1]]

}

/**
 * Run the highest version function where requester's version is >= function version
 */
function pickFunctionByVersion(req: Request, args: RouteVersionFunctions) {

    let versionFromClient = req.headers['accept-version'];

    if (!versionFromClient || Array.isArray(versionFromClient)) {
        let latestFunc = getLatestFunctionVersion(args)
        if (!latestFunc) {
            throw new Error(`No function defined for ${req.originalUrl}`);
        }
        return latestFunc;
    }

    let [clientMajor, clientMinor, clientSub] = versionFromClient.split(/\./g);

    let functionToRun = Object.values(args)[0]//set default as the earliest

    for (let version of Object.keys(args)) {
        let [major, minor, sub] = version.split(/\./g);

        if (Number(clientMajor) > Number(major)) {
            functionToRun = args[version];
            continue;
        } else if (Number(clientMajor) < Number(major)) {
            break;
        }

        if (Number(clientMinor) > Number(minor)) {
            functionToRun = args[version];
            continue;
        } else if (Number(clientMinor) < Number(minor)) {
            break;
        }

        if (Number(clientSub) >= Number(sub)) {
            functionToRun = args[version];
        }
    }

    return functionToRun;

}

/**
 * Return the correct function to run 
 */
function routeVersionHandler(args: RouteVersionFunctions) {
    return function (req: Request, res: Response, next: NextFunction) {
        let functionToRun = pickFunctionByVersion(req, args);
        return functionToRun(req, res, next);
    }
}

export const exportsForTesting = {
    getLatestFunctionVersion,
    pickFunctionByVersion
}

export {
    routeVersionHandler
}