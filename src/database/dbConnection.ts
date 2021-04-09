import {getConnectionManager} from "typeorm";
import Env from "../utils/Env";
import CakePhpNamingStrategy from "./CakePhpNamingStrategy";

const connectionManager = getConnectionManager();
const dbConnection = connectionManager.create({
    type: "mysql",
    url: Env.getString('DATABASE_URL'),
    charset: 'utf8mb4',
    timezone: 'Z',
    namingStrategy: new CakePhpNamingStrategy(),
    entities: [`${__dirname}/entities/*.{js,ts}`],
    synchronize: Env.getBool('DATABASE_SYNCING', true),
    logging: Env.getBool('DATABASE_LOGGING', true),
});

export default dbConnection;