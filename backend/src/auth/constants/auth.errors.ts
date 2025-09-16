export abstract class AuthErrors{
    static readonly VALID_NAME = "Name must be a string" ;
    static readonly NAME_IS_REQUIRED = "Name is required";
    static readonly VALID_PROFILE = "Profile image must be a string" ;
    static readonly TOKEN_NOT_FOUND = "Token not found";
    static readonly USER_NOT_EXIST = "User doesnt exist";
    static readonly USER_NOT_FOUND = "User not found";
    static readonly OLD_PASSWORD_NOT_MATCHED = "Old Password doesnt match";
    static readonly EMAIL_ALREADY_EXISTS = "Email already exists";
    static readonly INVALID_CREDENTIALS = "Invalid credentials";
    static readonly INVALID_TOKEN = "Token is invalid";
    static readonly USER_PERMISSIONS_NOT_EXISTS = "User permissions dont exist!";
    static readonly Validation_PASSWORD = "Password should be atleast 8 digits long, including 1 number, 1 special character and 1 capital letter";
    static readonly PASSWORD_REQUIRED = "Password is required";
    static readonly PASSWORD_VALID = "Password must be a string";
    static readonly USER_ROLE_VALIDATION = "User role must be organizer or attendee";
    static readonly OLD_PASSWORD_VALID = "Old password must be a string";
    static readonly OLD_PASSWORD_REQUIRED = "Old password is required";
    static readonly OLD_PASSWORD_REQUIREMENT = "Old password must be at least 8 characters long";
    static readonly NEW_PASSWORD_VALID = "New password must be a string";
    static readonly NEW_PASSWORD_REQUIRED = "New password is required";
    static readonly NEW_PASSWORD_REQUIREMENT = "New password must be at least 8 characters long";
    static readonly VALID_PROVIDER = 'Provider must be google or twitter';
    static readonly REFRESH_TOKEN = "Refresh Token must be a string";
}