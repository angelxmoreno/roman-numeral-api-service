import { ExpressMiddlewareInterface, Middleware, NotFoundError } from 'routing-controllers';
import { Request, Response } from 'express';
import normalizeError from '../helpers/normalizeError';

@Middleware({ type: 'after' })
export class NotFoundMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response): void {
    if (!res.headersSent) {
      const payload = normalizeError(new NotFoundError(`${req.method} ${req.path} not found`));
      console.log('payload', payload);
      res.status(404).json(payload);
    }
    res.end();
  }
}
