import type { NextApiRequest } from 'next'
import type { UserAgent } from 'next-useragent'

// @ts-ignore
export interface AuthorizedApiRequest<Body = any, Query = any> extends NextApiRequest {
  ua?: UserAgent | null
  auth: IAuthorizedUser
  body: Body
  query: Query
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
