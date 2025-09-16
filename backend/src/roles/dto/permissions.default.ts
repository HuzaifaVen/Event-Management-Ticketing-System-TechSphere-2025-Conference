// permissions.defaults.ts
import { UserRole } from "../enums/userRoles.dto";
import { Resources } from "../enums/resources.enum";
import { Actions } from "../enums/actions.enum";
import { Permission } from "../dto/permissions.dto";

export const DefaultRolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: [
    {
      resource: Resources.EVENTS,
      actions: [Actions.READ,Actions.READ], 
    },
  ],
  [UserRole.ORGANIZER]: [
    {
      resource: Resources.EVENTS,
      actions: [Actions.READ, Actions.WRITE, Actions.UPDATE], 
    },
    {
      resource: Resources.USERS,
      actions: [Actions.READ], 
    },
  ],
  [UserRole.ADMIN]: [
    {
      resource: Resources.EVENTS,
      actions: [Actions.READ, Actions.WRITE, Actions.UPDATE, Actions.DELETE],
    },
    {
      resource: Resources.USERS,
      actions: [Actions.READ, Actions.UPDATE, Actions.DELETE],
    },
    {
      resource: Resources.ORGANIZER,
      actions: [Actions.READ, Actions.UPDATE, Actions.DELETE],
    },
  ],
};
