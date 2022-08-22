import { BadRequestException, createHandler, Get, HttpCode, Req } from '@storyofams/next-api-decorators'
import { instanceToPlain } from 'class-transformer'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { PaginateService } from '~/server-side/services/PaginateService'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { User } from '~/server-side/useCases/user/user.entity'

const searchFields = ['id', 'name']
const orderFields = [
  ['User.id', 'id'],
  ['User.name', 'name']
]

class UserHandler {
  @Get()
  @HttpCode(200)
  @JwtAuthGuard()
  @Pagination()
  async users(@Req() req: AuthorizedPaginationApiRequest) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(User)

    const { search, order } = req.pagination
    const queryText = search ? searchFields.map(field => `User.${field} LIKE :search`) : null

    const query = repo.createQueryBuilder('User').select()
    // .addSelect(['Company.id', 'Company.name'])
    // .innerJoin('Jobtitle.company', 'Company');

    if (queryText) query.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'User', orderFields }).querySetup(query)

    const paginateService = new PaginateService('users')
    const paginated = await paginateService.paginate(query, req.pagination)
    return { success: true, ...paginated }
  }

  @Get('/me')
  @HttpCode(200)
  @JwtAuthGuard()
  async me(@Req() req: AuthorizedApiRequest) {
    const { auth } = req
    const ds = await prepareConnection()
    const repo = ds.getRepository(User)
    const user = await repo.findOne({ where: { id: auth.userId } })
    if (!user) throw new BadRequestException()

    return { success: true, user: instanceToPlain(user) }
  }
}

export default createHandler(UserHandler)
