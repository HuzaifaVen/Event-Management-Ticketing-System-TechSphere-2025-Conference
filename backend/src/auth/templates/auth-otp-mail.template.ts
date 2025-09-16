
export const otpEmailTemplate = (otp: string): string => `
  <p>Forgot your password?</p>
  <p>Your OTP is: <b>${otp}</b></p>
  <p>If you didn’t request this, please ignore this email.</p>
`;
