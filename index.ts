import { NextFunction } from 'express';
import { VersionedRequest, VersionedResponse, RouteVersionFunctions } from './types'


function getLatestFunctionVersion(args: RouteVersionFunctions): null | Function {
    let versions = Object.keys(args);
    if (versions.length === 0) {
        return null
    }

    return args[versions[versions.length]]

}

function pickFunctionByVersion(req: VersionedRequest, res: VersionedResponse, next: NextFunction, args: RouteVersionFunctions) {

    let versionFromClient = req.headers['accept-version'];

    if (!versionFromClient || Array.isArray(versionFromClient)) {
        let latestFunc = getLatestFunctionVersion(args)
        if (!latestFunc) {
            throw new Error(`No function defined for ${req.originalUrl}`);
        }
        return next(latestFunc(req, res, next));
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

    return next(functionToRun(req, res, next));

}

function routeVersionHandler(args: Record<string, Function>) {
    return (req: VersionedRequest, res: VersionedResponse, next: NextFunction) => pickFunctionByVersion(req, res, next, args);
}

export {
    routeVersionHandler
}