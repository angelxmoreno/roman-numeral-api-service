import {getEnvBoolean, getEnvFloat, getEnvInteger, getEnvString} from 'getenv.ts';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

dotenvExpand(dotenv.config());

export default class Env {
    static getString(env: string, fallback?: string): string {
        return getEnvString(env, fallback);
    }

    static getBool(env: string, fallback?: boolean): boolean {
        return getEnvBoolean(env, fallback);
    }

    static getFloat(env: string, fallback?: number): number {
        return getEnvFloat(env, fallback);
    }

    static getInteger(env: string, fallback?: number): number {
        return getEnvInteger(env, fallback);
    }

    static isDevelopment(): boolean {
        return this.getString('NODE_ENV') === 'development';
    }
};
