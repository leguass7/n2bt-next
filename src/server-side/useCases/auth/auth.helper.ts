import type { Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

import type { IAuthorizedUser } from './auth.dto'

export type JwtOrSession = (JWT | Session) & { level?: number }
export function authorizedDto(data: JwtOrSession): IAuthorizedUser {
  const level = (data?.level || 0) as number
  //@ts-ignore
  return { userId: data?.sub || '', name: data?.name || '', email: data?.email || '', level }
}
