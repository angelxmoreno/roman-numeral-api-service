import {Get, HttpError, JsonController, QueryParam, Req, Res, UseBefore} from 'routing-controllers';
import {requestLogger} from "../utils/Logger";
import {RequestWithId} from "../middlewares/requestId";
import {toArabic, toRoman} from 'roman-numerals'
import AnonymousUserEntity from "../database/entities/AnonymousUserEntity";
import {NextFunction, Response} from "express";

@JsonController('/api/v1')
@UseBefore(async (request: RequestWithId, response: Response, next: NextFunction): Promise<void> => {
    if (!(await AnonymousUserEntity.canRequestAccess(request))) {
        const error = new HttpError(401, 'You have reached your limit. Please register and use an api key.');
        return next(error);
    }
    response.locals.user = await AnonymousUserEntity.createFromRequest(request);
    next();
})

export default class ApiController {
    @Get('/to-roman')
    async toRoman(@Req() req: RequestWithId, @Res() rep: Response, @QueryParam('number') decimalNumber: number) {
        requestLogger(req, `Converting ${decimalNumber} to decimal`);

        const romanNumber = toRoman(decimalNumber);
        return {romanNumber, decimalNumber, user: rep.locals.user}
    }

    @Get('/to-decimal')
    toDecimal(@Req() req: RequestWithId, @QueryParam('number') romanNumberStr: string) {
        const romanNumber = romanNumberStr.toUpperCase();
        requestLogger(req, `Converting ${romanNumber} to roman`);

        const decimalNumber = toArabic(romanNumber);
        return {romanNumber, decimalNumber}
    }
}
