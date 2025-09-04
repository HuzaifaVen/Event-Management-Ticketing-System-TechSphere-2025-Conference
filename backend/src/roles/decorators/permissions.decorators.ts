import { SetMetadata } from "@nestjs/common"
import { AuthorizationPermission } from "../dto/permissions.dto"

export const PERMISSIONS_KEY = "permissions"
export const Permissions = (permissions: AuthorizationPermission[]) => SetMetadata(PERMISSIONS_KEY, permissions);

// @Permissions([{}])

