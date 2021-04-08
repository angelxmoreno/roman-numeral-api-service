import {getConnectionManager} from "typeorm";
import Env from "../utils/Env";

console.log('Env.getString(\'DATABASE_URL\')',Env.getString('DATABASE_URL'))
const connectionManager = getConnectionManager();
const dbConnection = connectionManager.create({
    type: "mysql",
    url: Env.getString('DATABASE_URL'),
    charset: 'utf8mb4',
    timezone: 'Z'
});

export default dbConnection;