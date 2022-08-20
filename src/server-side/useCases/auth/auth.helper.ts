import type { JWT } from 'next-auth/jwt'

import type { IAuthorizedUser } from './auth.dto'

export function authorizedDto(data: JWT): IAuthorizedUser {
  const level = (data?.level || 0) as number
  return {
    userId: data?.sub || '',
    name: data?.name || '',
    email: data?.email || '',
    level
  }
}
