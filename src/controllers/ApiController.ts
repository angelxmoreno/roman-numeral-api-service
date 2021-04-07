import {Get, JsonController, QueryParam, Req} from 'routing-controllers';
import {requestLogger} from "../utils/Logger";
import {RequestWithId} from "../middlewares/requestId";
import {toArabic, toRoman} from 'roman-numerals'

@JsonController('/api/v1')
export default class ApiController {
    @Get('/to-roman')
    toRoman(@Req() req: RequestWithId, @QueryParam('number') decimalNumber: number) {
        requestLogger(req, `Converting ${decimalNumber} to decimal`);

        const romanNumber = toRoman(decimalNumber);
        return {romanNumber, decimalNumber}
    }

    @Get('/to-decimal')
    toDecimal(@Req() req: RequestWithId, @QueryParam('number') romanNumberStr: string) {
        const romanNumber = romanNumberStr.toUpperCase();
        requestLogger(req, `Converting ${romanNumber} to roman`);

        const decimalNumber = toArabic(romanNumber);
        return {romanNumber, decimalNumber}
    }
}
