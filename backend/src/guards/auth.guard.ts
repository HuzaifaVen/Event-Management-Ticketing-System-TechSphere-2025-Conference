import { ExecutionContext, Injectable, CanActivate, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationGuard implements CanActivate{
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token  = this.extractTokenFromHeader(request);

        if(!token) throw new UnauthorizedException("Token does not exist")
        try{
            const payload = this.jwtService.verify(token)
            request.userId = payload.id;
        }
        catch(e){
            Logger.error(e.message);
            throw new UnauthorizedException("Token is invalid");
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