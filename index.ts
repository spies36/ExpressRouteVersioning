import { NextFunction } from 'express';
import { VersionedRequest, VersionedResponse, RouteVersionFunctions } from './types'

/**
 * Find the highest function version
 */
function getLatestFunctionVersion(args: RouteVersionFunctions): null | Function {
    let versions = Object.keys(args);
    if (versions.length === 0) {
        return null
    }

    return args[versions[versions.length - 1]]

}

/**
 * Run the highest version function where requester's version is >= function version
 */
async function pickFunctionByVersion(req: VersionedRequest, res: VersionedResponse, next: NextFunction, args: RouteVersionFunctions): Promise<Function> {

    let versionFromClient = req.headers['accept-version'];

    if (!versionFromClient || Array.isArray(versionFromClient)) {
        let latestFunc = getLatestFunctionVersion(args)
        if (!latestFunc) {
            throw new Error(`No function defined for ${req.originalUrl}`);
        }
        return latestFunc(req, res, next);
    }

    let [clientMajor, clientMinor, clientSub] = versionFromClient.split(/\./g);

    let functionToRun = args[0]

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

    return functionToRun(req, res, next);

}

/**
 * Return the correct function to run 
 */
function routeVersionHandler(args: RouteVersionFunctions) {
    return (req: VersionedRequest, res: VersionedResponse, next: NextFunction) => pickFunctionByVersion(req, res, next, args);
}

export const exportsForTesting = {
    getLatestFunctionVersion,
    pickFunctionByVersion
}

export {
    routeVersionHandler
}