import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response } from 'express';
import normalizeError, {GenericError} from "../helpers/normalizeError";

@Middleware({ type: 'after' })
export class JsonErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: GenericError | string, request: Request, response: Response): void | Response {
    console.error('error found', typeof error);
    const errorPayload = normalizeError(error);
    console.error('errorPayload', errorPayload);
    response.status(errorPayload.status).json(errorPayload).end();
  }
}
