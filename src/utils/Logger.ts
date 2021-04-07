import {createLogger, format, transports} from 'winston';
import {Request} from "express";
import {RequestWithId} from "../middlewares/requestId";

const {combine, timestamp, label, printf, simple, json} = format;

const appFormat = format((info, opts) => {
    const {level, message, timestamp, label} = info;
    info.message = `${timestamp} ${level} REQID [${label}] ${message}`
    return info;
});

export const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        json(),
    ),
    defaultMeta: {label: 'general'},

    transports: [
        new transports.Console({format: appFormat()})
    ],
});

export const requestLogger = (req:RequestWithId, message: string, level: undefined|string = 'info', meta: Record<string, unknown> = {}) => {
    logger.log(level, message, {
        ...meta,
        'request-id': req.id
    });
}