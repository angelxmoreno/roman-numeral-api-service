import BaseTransport, {TransportStreamOptions} from 'winston-transport'
import LogEntity from "../database/entities/LogEntity";

export default class DbLoggerTransport extends BaseTransport {
    constructor(opts?:TransportStreamOptions) {
        super(opts);
    }

    log(info: any, next: () => void): any {
        setImmediate(() => {
            this.emit('logged', info);
        });
        LogEntity.createFromLog(info)
        next();
    }

}
