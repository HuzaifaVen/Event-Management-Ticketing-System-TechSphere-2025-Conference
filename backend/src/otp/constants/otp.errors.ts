export abstract class OtpErrors{
    static readonly OTP_NOT_FOUND = "OTP not found!";
    static readonly INVALID_OTP = "Invalid OTP";
    static readonly OTP_EXPIRED = "OTP has been expired!"
    static readonly VALID_OTP = "OTP must be a string";
    static readonly OTP_REQUIRED = "OTP is required";
    static readonly OTP_REQUIREMENT = 'OTP must be exactly 6 digits';
}