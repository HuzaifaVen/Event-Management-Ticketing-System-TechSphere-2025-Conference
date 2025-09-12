import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { AuthErrors } from "src/auth/constants/auth.errors";
import { PERMISSIONS_KEY } from "src/roles/decorators/permissions.decorators";
import { AuthorizationPermission, Permission } from "src/roles/dto/permissions.dto";

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.userId) throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND)

        const routePermissions: AuthorizationPermission[] = await this.reflector.getAllAndOverride(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!routePermissions) {
            return true;
        }
        console.log("request id: ",request?.userId)

        try {
            const user = await this.authService.getUserPermissions(request?.userId);
            console.log("user: ",user)
            const userPermissions = user.permissions;

            if (!userPermissions) throw new UnauthorizedException(AuthErrors.USER_PERMISSIONS_NOT_EXISTS);

            for (const routePermission of routePermissions) {
                    console.log(routePermission.roles + "matched" + user.id)
                if (routePermission.roles && routePermission.roles.includes(user.role)) {
                    console.log(routePermission + "matched" + user.id)

                    const userPermission = userPermissions.find(
                        (perm) => perm.resource === routePermission.resource
                    )
                    if (!userPermission) throw new NotFoundException();

                    const allActionsAvailable = routePermission.actions.every(
                        (action) => userPermission.actions.includes(action),
                    )
                    console.log("matched: ",allActionsAvailable)

                    if (!allActionsAvailable) throw new NotFoundException();


                }
                else {
                    throw new UnauthorizedException("Roles dont match")
                }
            }
        }
        catch (e) {
            throw new NotFoundException()
        }
        return true
    }
}