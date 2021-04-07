import {RequestHandler} from 'express'
import morgan, {FormatFn} from 'morgan'
import {getRequestId} from "./requestId";
import {logger} from "../utils/Logger";
import os from 'os';

const getPid = (): string => {
    return String(process.pid);
}

const getHostname = (): string => {
    return os.hostname();
}

const format: FormatFn = (tokens, req, res) => JSON.stringify({
    'remote-address': tokens['remote-addr'](req, res),
    'time': tokens['date'](req, res, 'iso'),
    'method': tokens['method'](req, res),
    'url': tokens['url'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    'referrer': tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'hostname': tokens['hostname'](req, res),
    'pid': tokens['pid'](req, res),
    'request-id': tokens['id'](req, res),
});

const write = (jsonStr: string) => {
    const jsonObj = JSON.parse(jsonStr);
    logger.info([
        jsonObj['method'],
        jsonObj['url'],
        jsonObj['status-code'],
        jsonObj['remote-address'],
    ].join(' '), {
        ...jsonObj,
        label: 'request'
    })
}

morgan.token('id', getRequestId);
morgan.token('pid', getPid);
morgan.token('hostname', getHostname);
const requestLogger = (): RequestHandler => morgan(format, {
    stream: {
        write,
    }

})

export default requestLogger;