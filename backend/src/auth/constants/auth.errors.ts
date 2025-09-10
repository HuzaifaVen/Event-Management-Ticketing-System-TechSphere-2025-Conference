export abstract class AuthErrors{
    
    static readonly TOKEN_NOT_FOUND = "Token not found";
    static readonly USER_NOT_EXIST = "User doesnt exist";
    static readonly USER_NOT_FOUND = "User not found";
    static readonly OLD_PASSWORD_NOT_MATCHED = "Old Password doesnt match";
    static readonly EMAIL_ALREADY_EXISTS = "Email already exists";
    static readonly INVALID_CREDENTIALS = "Invalid credentials";
    static readonly INVALID_TOKEN = "Token is invalid";
    static readonly USER_PERMISSIONS_NOT_EXISTS = "User permissions dont exist!";
    static readonly Validation_PASSWORD = "Password should be atleast 8 digits long";
    static readonly USER_ROLE_VALIDATION = "User role must be organizer or attendee";
}