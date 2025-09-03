import { Controller, Get, Req, UseGuards,Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthenticationGuard } from "./guards/auth.guard";


@UseGuards(AuthenticationGuard)
@Controller()
export class AppController{
    constructor(private readonly appService: AppService){}
    
    @Get()
    someProtectedRoutes(@Req() req){
        console.log("user id: ", req.userId)
        return {message: "Accessed Resource", userId: req.userId};
    }
}