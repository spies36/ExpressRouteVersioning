import express, { Request, Response, NextFunction } from 'express';
import { routeVersionHandler } from './index';

const app = express();
const router = express.Router();

app.use(router);

/**
 * Example of an object that may be stored in res.locals from your fav fancy middleware
 */
type authStuff = {
    authInfo: {
        user: string,
        favLanguage: 'javascript',
    }
}

function fancyMiddleware(req: Request, res: Response, next: NextFunction) {
    let authInfoObj = {
        user: 'pizzMan',
        favLanguage: 'javascript'
    }
    res.locals.authInfo = authInfoObj

    return next()
}

//#region Test Functions 
function testFunc1(req: Request, res: Response<any, authStuff>, next: NextFunction) {
    console.log(res.locals.authInfo)
    return res.send('Test1');
}

async function testFunc2(req: Request, res: Response<any, authStuff>, next: NextFunction) {
    console.log(res.locals.authInfo)
    await new Promise(resolve => setTimeout(resolve, 3000));
    return res.send('Test2');
}
//#endregion


router.get('', (req: Request, res: Response, next: NextFunction) => {
    res.send("Server Up")
})

router.get('/doThings', fancyMiddleware, routeVersionHandler({
    '0.0.0': testFunc1,
    '0.1.0': testFunc2
}));


app.listen(8081, () => {
    console.log("Im alive");
});