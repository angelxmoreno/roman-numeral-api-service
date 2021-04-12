import {Body, Get, JsonController, Post, Req} from 'routing-controllers';
import {requestLogger} from "../utils/Logger";
import {RequestWithId} from "../middlewares/requestId";
import Registration from "../validation/validators/Registration";
import UserEntity from "../database/entities/UserEntity";
import {validateInstance} from "../validation/Validator";
import JwtService from "../utils/JwtService";
import PasswordIdentify from "../validation/validators/PasswordIdentify";

@JsonController('/auth/v1')
export default class AuthController {
    @Post('/register')
    async register(@Req() req: RequestWithId, @Body({required: true}) payload: any) {
        requestLogger(req, 'Registering user');
        const [isValid, user, errors] = await validateInstance(payload, Registration, UserEntity);

        if (isValid && user) {
            await user.save();
            const jwt = JwtService.fromUser(user);
            return {user, jwt}
        } else {
            return {errors}
        }
    }

    @Post('/identify')
    async identifyPost(@Req() req: RequestWithId, @Body({required: true}) payload: any) {
        requestLogger(req, 'Identifying user email/password');
        let user: UserEntity | undefined = undefined;
        const [isValid, userPartial, errors] = await validateInstance(payload, PasswordIdentify, UserEntity);
        if (isValid) {
            user = await UserEntity.findOne({where: {email: userPartial?.email}})
        }
        return {isValid, user, errors}
    }

    @Get('/identify')
    async identifyGet(
        @Req() req: RequestWithId
    ) {
        requestLogger(req, 'Identifying user tokens');
        const user = await UserEntity.getByRequest(req);

        return {isValid:!!user, user, errors: user ? [] : ['Can not identify you']}
    }
}
