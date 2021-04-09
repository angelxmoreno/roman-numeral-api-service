import {createLogger, format, transports} from 'winston';
import {RequestWithId} from "../middlewares/requestId";
import {v4 as uuidV4} from "uuid";
import DbLoggerTransport from "./DbLoggerTransport";

export interface LoggerJson {
    id: string,
    label?: string,
    level: string,
    message: string,
    timestamp: Date
}

const {combine, timestamp, simple, json, cli} = format;
const {Console,} = transports;

const uuid = format((info, opts) => {
    info['id'] = uuidV4();
    return info;
});

export const logger = createLogger({
    level: 'debug',
    format: combine(
        uuid(),
        timestamp(),
    ),
    defaultMeta: {label: 'general'},

    transports: [
        new Console({format: cli()}),
        new DbLoggerTransport({format: json()}),
    ],
});

export const requestLogger = (req: RequestWithId, message: string, level: undefined | string = 'info', meta: Record<string, unknown> = {}) => {
    logger.log(level, message, {
        ...meta,
        'request-id': req.id
    });
}