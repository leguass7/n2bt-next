import type { JWT } from 'next-auth/jwt'

import type { IAuthorizedUser } from './auth.dto'

export function authorizedDto(data: JWT): IAuthorizedUser {
  return {
    userId: data?.sub || '',
    name: data?.name || '',
    email: data?.email || ''
  }
}
