import * as bcrypt from 'bcrypt';


export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(password,salt){
  return await bcrypt.hash(password, salt);
}
