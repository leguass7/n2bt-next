import { BadRequestException, createHandler, Delete, Get, HttpCode, Patch, Post, Req } from '@storyofams/next-api-decorators'
import type { NextApiRequest } from 'next'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { PaginateService } from '~/server-side/services/PaginateService'
import { Pagination } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { IArena } from '~/server-side/useCases/arena/arena.dto'
import { Arena } from '~/server-side/useCases/arena/arena.entity'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'

const searchFields = ['id', 'name']
const orderFields = [
  ['Arena.id', 'id'],
  ['Arena.name', 'name']
]

class ArenaHandler {
  @Get('/list')
  @HttpCode(200)
  async list(@Req() _req: NextApiRequest) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(Arena)
    const arenas = await repo.find({ select: { id: true, title: true }, where: { published: true } })
    return { success: true, arenas }
  }

  @Get('/:arenaId')
  @HttpCode(200)
  async one(@Req() req: AuthorizedApiRequest) {
    const { auth, query } = req
    const arenaId = +query?.params[0] || 0

    const ds = await prepareConnection()
    const repo = ds.getRepository(Arena)
    const arena = await repo.findOne({ where: { id: arenaId, published: auth?.level <= 8 ? undefined : true } })
    if (!arena) throw new BadRequestException()

    return { success: true, arena }
  }

  @Patch('/:arenaId')
  @JwtAuthGuard()
  @HttpCode(200)
  async update(@Req() req: AuthorizedApiRequest) {
    const { auth, query, body } = req
    const arenaId = +query?.params[0] || 0
    if (!arenaId) throw new BadRequestException()

    const ds = await prepareConnection()
    const repo = ds.getRepository(Arena)
    const arena = await repo.update(arenaId, { ...body, updatedAt: new Date(), updatedBy: auth.userId })
    if (!arena) throw new BadRequestException()

    return { success: true, arenaId, affected: arena?.affected }
  }

  @Delete('/:arenaId')
  @JwtAuthGuard()
  @HttpCode(200)
  async remove(@Req() req: AuthorizedApiRequest) {
    const { query } = req
    const arenaId = +query?.params[0] || 0
    if (!arenaId) throw new BadRequestException()

    const ds = await prepareConnection()
    const repo = ds.getRepository(Arena)
    const deleted = await repo.delete(arenaId)
    if (!deleted) throw new BadRequestException()

    return { success: true, arenaId, affected: deleted?.affected }
  }

  @Get()
  @HttpCode(200)
  @Pagination()
  async paginate(@Req() req: AuthorizedPaginationApiRequest) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(Arena)

    const { search, order } = req.pagination
    const queryText = search ? searchFields.map(field => `Arena.${field} LIKE :search`) : null

    const query = repo.createQueryBuilder('Arena').select()
    // .addSelect(['Company.id', 'Company.name'])
    // .innerJoin('Jobtitle.company', 'Company');

    if (queryText) query.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'Arena', orderFields }).querySetup(query)

    const paginateService = new PaginateService('arena')
    const paginated = await paginateService.paginate(query, req.pagination)
    return { success: true, ...paginated }
  }

  @Post()
  @JwtAuthGuard()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest) {
    const { auth, body } = req

    const ds = await prepareConnection()
    const repo = ds.getRepository(Arena)
    const data = { ...body, createdAt: new Date(), createdBy: auth.userId, userId: auth.userId } as IArena
    const saveData = repo.create(data)
    const created = await repo.save(saveData)
    if (!created) throw new BadRequestException()

    return { success: true, arenaId: created?.id, arena: created }
  }
}

export default createHandler(ArenaHandler)
