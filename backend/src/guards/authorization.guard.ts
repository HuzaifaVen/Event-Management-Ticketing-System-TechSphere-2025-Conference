import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";
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

        if (!request.userId) throw new UnauthorizedException("User not found")

        const routePermissions: AuthorizationPermission[] = await this.reflector.getAllAndOverride(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        );

        console.log(`Required Permissions are \n ${JSON.stringify(routePermissions, null, 2)}`);

        try {
            const user = await this.authService.getUserPermissions(request?.userId);
            const userPermissions = user.permissions;
            console.log("request id: ", request?.userId)

            console.log(`User Permissions are \n ${JSON.stringify(userPermissions, null, 2)}`);
            if (!userPermissions) throw new UnauthorizedException("User permission doesnt exist");

            for (const routePermission of routePermissions) {
                    
                if (routePermission.roles && routePermission.roles.includes(user.role)) {
                    console.log(`${user.role} and ${routePermission.roles}`)
                    const userPermission = userPermissions.find(
                        (perm) => perm.resource === routePermission.resource
                    )
                    if (!userPermission) throw new NotFoundException();

                    const allActionsAvailable = routePermission.actions.every(
                        (action) => userPermission.actions.includes(action),
                    )

                    if (!allActionsAvailable) throw new NotFoundException();
                }
                else{
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