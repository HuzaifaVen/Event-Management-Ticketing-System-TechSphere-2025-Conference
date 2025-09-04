import { Controller, Get, Req, UseGuards,Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthenticationGuard } from "./guards/auth.guard";
import { Resources } from "./roles/enums/resources.enum";
import { Actions } from "./roles/enums/actions.enum";
import { Permissions } from "./roles/decorators/permissions.decorators";
import { AuthorizationGuard } from "./guards/authorization.guard";
import { UserRole } from "./roles/enums/userRoles.dto";

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller()
export class AppController{
    constructor(private readonly appService: AppService){}
    
    @Permissions([{roles:[UserRole.ORGANIZER],resource: Resources.USERS, actions: [Actions.READ]}])
    @Get()
    someProtectedRoutes(@Req() req){
        console.log("user id: ", req.userId)
        return {message: "Accessed Resource", userId: req.userId};
    }
}