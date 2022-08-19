import type { SelectQueryBuilder } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import type { QueryPagination } from './paginate.middleware'

export interface IResponsePaginated<T = any> extends IResponseApi {
  total: number
  size: number
  page: number
  data: T[]
}

export class PaginateService {
  constructor(private name?: string) {}

  async paginate<T>(builder: SelectQueryBuilder<T>, pagination: QueryPagination, raw?: boolean): Promise<IResponsePaginated<T>> {
    const { page, size } = pagination
    const skip = (page - 1) * size
    const total = await builder.getCount()

    const query = builder.skip(skip).take(size)

    const data = raw ? await query.getRawMany() : await query.getMany()
    return { page, size, total, data }
  }
}
