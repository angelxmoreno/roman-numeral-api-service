import {Body, JsonController, Post, Req} from 'routing-controllers';
import {requestLogger} from "../utils/Logger";
import {RequestWithId} from "../middlewares/requestId";
import Registration from "../validation/validators/Registration";
import UserEntity from "../database/entities/UserEntity";
import {validateInstance} from "../validation/Validator";
import JwtService from "../utils/JwtService";

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
}
