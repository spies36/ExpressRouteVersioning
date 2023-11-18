import express, { Request, Response, NextFunction } from 'express';
import { routeVersionHandler } from './index';
import { authStuff } from './types'

const app = express();
const router = express.Router();

app.use(router);


function fancyMiddleware(req: Request, res: Response, next: NextFunction) {
    let authInfoObj = {
        user: 'pizzMan',
        favLanguage: 'javascript'
    }
    res.locals.authInfo = { authStuff: authInfoObj }

    return next()
}


function testFunc1(req: Request, res: Response<any, authStuff>, next: NextFunction) {
    console.log(res.locals.authStuff)
    return res.send('Test1');
}

function testFunc2(req: Request, res: Response<any, authStuff>, next: NextFunction) {
    console.log(res.locals.authStuff)
    return res.send('Test2');
}

router.get('', (req: Request, res: Response, next: NextFunction) => {
    res.send("Server Up")
})

router.get('/doThings', fancyMiddleware, routeVersionHandler({
    '0.0.0': testFunc1,
    '0.1.0': testFunc2
}));


app.listen(8081, () => {
    console.log("Im alive");
})