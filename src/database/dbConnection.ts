import {getConnectionManager} from "typeorm";
import Env from "../utils/Env";

const connectionManager = getConnectionManager();
const dbConnection = connectionManager.create({
    type: "mysql",
    url: Env.getString('DATABASE_URL'),
    charset: 'utf8mb4',
    timezone: 'Z'
});

export default dbConnection;