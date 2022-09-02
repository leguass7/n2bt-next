import { BadRequestException, createHandler, Delete, Get, HttpCode, Patch, Post, Req } from 'next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { PaginateService } from '~/server-side/services/PaginateService'
import { Pagination } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import type { IRanking } from '~/server-side/useCases/ranking/ranking.dto'
import { Ranking } from '~/server-side/useCases/ranking/ranking.entity'

const searchFields = ['Ranking.userId', 'User.name']
const orderFields = [
  ['Ranking.id', 'id'],
  ['User.name', 'user']
]

class RankingHandler {
  @Get('/list')
  @Pagination()
  @HttpCode(200)
  async list(@Req() req: AuthorizedPaginationApiRequest) {
    const { query } = req
    const { order } = req?.pagination

    const categoryId = +query?.categoryId || 0
    const ds = await prepareConnection()
    const repo = ds.getRepository(Ranking)

    const queryDb = repo
      .createQueryBuilder('Ranking')
      .select()
      .addSelect(['User.id', 'User.name', 'User.image', 'User.email'])
      .addSelect(['Category.id', 'Category.title'])
      .addSelect(['Tournament.id', 'Tournament.title'])
      .innerJoin('Ranking.user', 'User')
      .innerJoin('Ranking.category', 'Category')
      .innerJoin('Category.tournament', 'Tournament')
      .orderBy('Ranking.points', 'DESC')
      .addOrderBy('User.name', 'ASC')
      .where({ categoryId })

    parseOrderDto({ order, table: 'Ranking', orderFields }).querySetup(queryDb)

    const rankings = await queryDb.getMany()

    return { success: true, rankings }
  }

  @Patch('/:rankingId')
  @JwtAuthGuard()
  @HttpCode(200)
  async update(@Req() req: AuthorizedApiRequest) {
    const { auth, query, body } = req
    const rankingId = +query?.params[0] || 0
    if (!rankingId) throw new BadRequestException()

    const ds = await prepareConnection()
    const repo = ds.getRepository(Ranking)
    const ranking = await repo.update(rankingId, { ...body, updatedAt: new Date(), updatedBy: auth.userId })
    if (!ranking) throw new BadRequestException()

    return { success: true, rankingId, affected: ranking?.affected }
  }

  @Delete('/:rankingId')
  @JwtAuthGuard()
  @HttpCode(200)
  async remove(@Req() req: AuthorizedApiRequest) {
    const { query } = req
    const rankingId = +query?.params[0] || 0
    if (!rankingId) throw new BadRequestException()

    const ds = await prepareConnection()
    const repo = ds.getRepository(Ranking)
    const deleted = await repo.delete(rankingId)
    if (!deleted) throw new BadRequestException()

    return { success: true, rankingId, affected: deleted?.affected }
  }

  @Get()
  @HttpCode(200)
  @Pagination()
  async paginate(@Req() req: AuthorizedPaginationApiRequest) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(Ranking)

    const categoryId = +req?.query?.categoryId
    if (!categoryId) throw new BadRequestException('Categoria inválida')

    const { search, order } = req.pagination
    const queryText = search ? searchFields.map(field => `${field} LIKE :search`) : null

    const queryDb = repo
      .createQueryBuilder('Ranking')
      .select()
      .addSelect(['Category.id', 'Category.title'])
      .addSelect(['User.id', 'User.name', 'User.image', 'User.email', 'User.nick', 'User.gender', 'User.completed'])
      .innerJoin('Ranking.category', 'Category')
      .innerJoin('Ranking.user', 'User')
      .where({ categoryId })

    if (queryText) queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'Ranking', orderFields }).querySetup(queryDb)

    const paginateService = new PaginateService('Ranking')
    const paginated = await paginateService.paginate(queryDb, req.pagination)
    return { success: true, ...paginated }
  }

  // @Get()
  // @HttpCode(200)
  // @Pagination()
  // async paginate(@Req() req: AuthorizedPaginationApiRequest) {
  //   const ds = await prepareConnection()
  //   const repo = ds.getRepository(Tournament)

  //   const arenaId = +req?.query?.arenaId
  //   if (!arenaId) throw new BadRequestException('not_found_arenaId')

  //   const { search, order } = req.pagination
  //   const queryText = search ? searchFields.map(field => `Tournament.${field} LIKE :search`) : null

  //   const queryDb = repo.createQueryBuilder('Tournament').select().where({ arenaId })

  //   if (queryText) queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
  //   parseOrderDto({ order, table: 'Tournament', orderFields }).querySetup(queryDb)

  //   const paginateService = new PaginateService('tournament')
  //   const paginated = await paginateService.paginate(queryDb, req.pagination)
  //   return { success: true, ...paginated }
  // }

  @Post()
  @JwtAuthGuard()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest<IRanking>) {
    const { auth, body } = req

    const ds = await prepareConnection()
    const repo = ds.getRepository(Ranking)

    const has = await repo.findOne({ where: { categoryId: body?.categoryId, userId: body?.userId } })
    if (!!has) throw new BadRequestException()

    const data = { ...body, createdAt: new Date(), createdBy: auth.userId } as IRanking
    const saveData = repo.create(data)
    const created = await repo.save(saveData)
    if (!created) throw new BadRequestException()

    return { success: true, rankingId: created?.id, ranking: created }
  }
}

export default createHandler(RankingHandler)
