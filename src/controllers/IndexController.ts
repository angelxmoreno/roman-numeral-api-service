import {Get, JsonController, Req} from 'routing-controllers';
import {requestLogger} from "../utils/Logger";
import {RequestWithId} from "../middlewares/requestId";

@JsonController()
export default class IndexController {
    @Get('/')
    home(@Req() req: RequestWithId): { status: string } {
        requestLogger(req, 'I am the home route');
        return {
            status: 'ok'
        };
    }
}
