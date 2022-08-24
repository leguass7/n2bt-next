import type { NextApiRequest } from 'next'
import type { UserAgent } from 'next-useragent'

export interface AuthorizedApiRequest<Body = any> extends NextApiRequest {
  ua?: UserAgent | null
  auth: IAuthorizedUser
  body: Body
}

export interface PublicApiRequest<Body = any> extends NextApiRequest {
  ua?: UserAgent | null
  body: Body
}

export interface IAuthorizedUser {
  userId: string
  name: string
  email?: string
  level?: number
}
