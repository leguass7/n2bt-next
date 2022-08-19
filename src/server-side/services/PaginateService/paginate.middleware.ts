import { createMiddlewareDecorator, NextFunction } from '@storyofams/next-api-decorators'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'

type Order = 'ASC' | 'DESC'
export type ArrayOrder = [
  /** field */
  string,
  /** order */
  Order
]

export interface QueryPagination {
  page?: number
  size?: number
  order?: ArrayOrder[]
  search?: string
}

function extractRequestArray<T extends string>(queryOrder: string | string[]): T[] {
  if (!queryOrder) return []
  if (queryOrder instanceof Array) return queryOrder as T[]
  return queryOrder.split(',') as T[]
}

export interface AuthorizedPaginationApiRequest<Body = any> extends AuthorizedApiRequest<Body> {
  body: Body
  pagination: any
}

export interface AuthorizedPaginationApiRequest<Body = any> extends NextApiRequest {
  body: Body
  pagination: any
}

export const Pagination = createMiddlewareDecorator((req: AuthorizedPaginationApiRequest, res: NextApiResponse, next: NextFunction) => {
  const { query } = req

  const page = parseInt(`${query?.page || 1}`, 10) || 1
  const size = parseInt(`${query?.size || 12}`, 10) || 12
  const reqOrder = extractRequestArray<Order>(`${query?.order}`.toUpperCase())
  const reqOrderBy = query?.orderby ? extractRequestArray(`${query.orderby}`) : []

  const search = query?.search ? `${query?.search}` : null

  const order = reqOrderBy.reduce((o, item, i) => {
    const ord: Order = reqOrder[i] ? `${reqOrder[i] === 'DESC' ? reqOrder[i] : 'ASC'}` : 'ASC'
    o.push([item, ord])
    return o
  }, [] as ArrayOrder[])

  req.pagination = { page, size, order, search }

  if (next) return next()

  next()
})
