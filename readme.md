# Express Route Versioning Middleware

No more versioning routes by adding parameters to the url or adding to the path name. Simply add ```accept-version: versionNumber``` to the request headers and let your middleware choose the correct function.

## Why use this version
This version does not dictate your express.Request, express.Response, or NextFunction types for the RouteHandler. So if you have a middleware before/after that adjusts response.locals to a strict type this will play nicely in TS.

## Usage

**Version numbers must be in ascending order**

Basic express usage
```
import express, { Request, Response, NextFunction } from 'express';
import { routeVersionHandler } from 'express-route-versioning-middleware';

const app = express();
const router = express.Router();

app.use(router);

//curl --header "accept-version: 0.1.5" localhost:8081/doThings
//Will hit testFunc2
router.get('/doThings', routeVersionHandler({
    '0.0.0': testFunc1,
    '0.1.0': testFunc2,
    '1.2.3': testFunc3
}));

```

Same example but with middleware for auth before route versioning.

```
//curl --header "accept-version: 0.1.5" localhost:8081/doThings
//Will hit testFunc2 with fancyAuthMiddleware's next()
router.get('/doThings', fancyAuthMiddleware, routeVersionHandler({
    '0.0.0': testFunc1,
    '0.1.0': testFunc2,
    '1.2.3': testFunc3
}));

```

## Versioning Logic

Run the highest version function where requester's version is >= function version

In simple terms
```
'minimumVersionRequired': functionToCall
```

Examples:
```
routeVersionHandler({
    '0.0.0': testFunc1,
    '0.1.0': testFunc2,
    '1.0.0': testFunc3,
    '1.2.3': testFunc4
})

testFunc1
curl --header "accept-version: 0.0.0" localhost:8081/doThings

testFunc1
curl --header "accept-version: 0.0.999" localhost:8081/doThings

testFunc3
curl --header "accept-version: 1.2.2" localhost:8081/doThings

testFunc4
curl --header "accept-version: 1.2.3" localhost:8081/doThings

```

## Similar packages

- https://www.npmjs.com/package/express-version-route
- https://www.npmjs.com/package/express-routes-versioning (I really like this one, it just does not play nice with middlewares changing locals.)


