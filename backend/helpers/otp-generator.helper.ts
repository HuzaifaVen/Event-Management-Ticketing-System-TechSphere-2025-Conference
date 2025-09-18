import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

export function otpGenerator(){
    return crypto.randomInt(100000, 1000000).toString();
}

export async function hashOtp(otp, number){
    return await bcrypt.hash(otp, number);
}

export async function compareOtp(otp,dbOtp){
    return await bcrypt.compare(otp, dbOtp);
}