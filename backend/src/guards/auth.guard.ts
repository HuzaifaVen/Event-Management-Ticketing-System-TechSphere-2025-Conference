import { ExecutionContext, Injectable, CanActivate, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthErrors } from "src/auth/constants/auth.errors";

@Injectable()
export class AuthenticationGuard implements CanActivate{
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log("auth working")
        const request = context.switchToHttp().getRequest();
        const token  = this.extractTokenFromHeader(request);

        if(!token) throw new UnauthorizedException(AuthErrors.TOKEN_NOT_FOUND)
        try{
            const payload = this.jwtService.verify(token)
            request.userId = payload.id;
        }
        catch(e){
            Logger.error(e.message);
            throw new UnauthorizedException(AuthErrors.INVALID_TOKEN);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request) : string | undefined {
        const auth = request.headers['authorization'];
        const [scheme, token] =  auth?.split(' ');
        if( scheme != 'Bearer' || !token) return undefined;
        return token;
    }
}