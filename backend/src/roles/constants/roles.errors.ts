export abstract class RoleErrors{
    static readonly ROLE_ALREADY_EXIST = "Role already exists!";
    static readonly ROLE_NOT_EXISTS = "Role doesnt exist!";
    static readonly VALID_ROLE = "Role ID must be a valid UUID";
  // Resource errors
  static readonly RESOURCE_REQUIRED = "Resource is required";
  static readonly RESOURCE_INVALID = "Resource must be a valid enum value";

  // Actions errors
  static readonly ACTIONS_REQUIRED = "Actions array cannot be empty";
  static readonly ACTIONS_INVALID_ARRAY = "Actions must be an array";
  static readonly ACTIONS_INVALID_ENUM = "Each action must be a valid enum value";

  // Roles errors
  static readonly ROLES_INVALID_ARRAY = "Roles must be an array";

  static readonly VALID_PERMISSIONS= "Permissions must be an array";
  static readonly PERMISSIONS_REQUIRED = "Permissions array cannot be empty if provided";
}
