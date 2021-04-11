import {Get, HttpError, JsonController, QueryParam, Req, Res, UseBefore} from 'routing-controllers';
import {requestLogger} from "../utils/Logger";
import {RequestWithId} from "../middlewares/requestId";
import {toArabic, toRoman} from 'roman-numerals'
import AnonymousUserEntity from "../database/entities/AnonymousUserEntity";
import {NextFunction, Response} from "express";
import UserEntity from "../database/entities/UserEntity";

@JsonController('/api/v1')
@UseBefore(async (request: RequestWithId, response: Response, next: NextFunction): Promise<void> => {
    const user = await UserEntity.getByRequest(request);
    if (user) {
        response.locals.user = user;
        response.locals.userType = 'user';
    } else if (!(await AnonymousUserEntity.canRequestAccess(request))) {
        const error = new HttpError(401, 'You have reached your limit. Please register and use an api key.');
        return next(error);
    } else {
        response.locals.user = await AnonymousUserEntity.createFromRequest(request);
        response.locals.userType = 'anonymous';
    }
    next();
})
export default class ApiController {
    @Get('/to-roman')
    toRoman(@Req() req: RequestWithId, @Res() rep: Response, @QueryParam('number', {required: true}) decimalNumber: number) {
        const {user, userType} = rep.locals
        requestLogger(req, `Converting ${decimalNumber} to decimal for ${userType}`, 'info', {user});

        const romanNumber = toRoman(decimalNumber);
        return {romanNumber, decimalNumber, userType};
    }

    @Get('/to-decimal')
    toDecimal(@Req() req: RequestWithId, @Res() rep: Response, @QueryParam('number', {required: true}) romanNumberStr: string) {
        const romanNumber = romanNumberStr.toUpperCase();
        const {user, userType} = rep.locals
        requestLogger(req, `Converting ${romanNumber} to roman for ${userType}`, 'info', {user});

        const decimalNumber = toArabic(romanNumber);
        return {romanNumber, decimalNumber, userType};
    }
}
