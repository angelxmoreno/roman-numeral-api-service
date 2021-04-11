import express, {Application} from 'express';
import {useExpressServer} from 'routing-controllers';
import compression from 'compression';
import {JsonErrorHandler} from './middlewares/JsonErrorHandler';
import {NotFoundMiddleware} from './middlewares/NotFoundMiddleware';
import Env from "./utils/Env";
import requestLogger from "./middlewares/requestLogger";
import requestId from "./middlewares/requestId";
import UserEntity from "./database/entities/UserEntity";

const server: Application = express(); // your created express server
server.use(requestId());
server.use(requestLogger());
server.use(compression());
useExpressServer(server, {
    cors: true,
    defaultErrorHandler: false,
    controllers: [`${__dirname}/controllers/*`],
    middlewares: [NotFoundMiddleware, JsonErrorHandler],
    development: Env.isDevelopment(),
    currentUserChecker: action => UserEntity.getByRequest(action.request)
});


export default server;
