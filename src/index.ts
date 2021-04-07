import 'reflect-metadata';
import server from './server';
import Env from './utils/Env';
import {logger} from "./utils/Logger";

const PORT = Env.getInteger('PORT', 3000);
const BASE_URL = Env.getString('BASE_URL', 'http://127.0.0.1');

server.listen(PORT, () => {
    logger.info(`Server is running at ${BASE_URL}:${PORT}`, {label:'⚡️server'});
});

