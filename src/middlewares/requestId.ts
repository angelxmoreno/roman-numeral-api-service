import {NextFunction, Request, RequestHandler, Response} from 'express'
import {v4 as uuidV4} from 'uuid'

export interface RequestWithId extends Request {
    id: string
}

export const getRequestId = (req: RequestWithId): string => {
    return req.id
}

const assignId: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    (req as RequestWithId).id = uuidV4()
    next()
}

const requestId = (): RequestHandler[] => [assignId]
export default requestId;