import { createHandler, Get, HttpCode, Req } from '@storyofams/next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import { IfAuth } from '~/server-side/useCases/auth/middleware'
import { Category } from '~/server-side/useCases/category/category.entity'
const orderFields = [
  ['Category.id', 'id'],
  ['Category.title', 'title']
]

class CategoryHandler {
  @Get('/list')
  @IfAuth()
  @Pagination()
  @HttpCode(200)
  async list(@Req() req: AuthorizedPaginationApiRequest) {
    const { query } = req
    const { order, size = 1000 } = req?.pagination
    const tournamentId = +query?.tournamentId || 0

    const ds = await prepareConnection()
    const repo = ds.getRepository(Category)

    const queryDb = repo
      .createQueryBuilder('Category')
      .select()
      .addSelect(['Tournament.id', 'Tournament.title'])
      .innerJoin('Category.tournament', 'Tournament')
      .where({ published: true, tournamentId })
      .take(size)

    parseOrderDto({ order, table: 'Category', orderFields }).querySetup(queryDb)

    const categories = await queryDb.getMany()

    return { success: true, categories }
  }
}

export default createHandler(CategoryHandler)
