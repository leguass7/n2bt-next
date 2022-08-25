import { hash } from 'bcrypt'

export async function generateHashPassword(password: string) {
  const Pbcrypt = await hash(password, 8)
  return Pbcrypt
}

export function generatePassword() {
  // return timeStamp().toLowerCase().slice(-6);
  return Math.random()
    .toString(36)
    .replace(/[ilLI|`oO0]/g, '')
    .slice(-6)
}
