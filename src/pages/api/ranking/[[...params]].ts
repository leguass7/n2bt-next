import { BadRequestException, createHandler, Delete, Get, HttpCode, Patch, Post, Req } from 'next-api-decorators'
import type { DeepPartial } from 'typeorm'

import { makeArray } from '~/helpers/array'
import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { PaginateService } from '~/server-side/services/PaginateService'
import { Pagination } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import type { IRanking } from '~/server-side/useCases/ranking/ranking.dto'
import { Ranking } from '~/server-side/useCases/ranking/ranking.entity'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

const searchFields = ['Ranking.userId', 'User.name']
const orderFields = [
  ['Ranking.id', 'id'],
  ['User.name', 'user']
]

class RankingHandler {
  @Get('/find')
  @JwtAuthGuard()
  @HttpCode(200)
  async search(@Req() req: AuthorizedApiRequest) {
    const { query } = req

    const categoryId = +query?.categoryId || 0
    const userId = ((query?.userId as string) || '').split(',').filter(f => !!f)

    if (!categoryId) throw new BadRequestException('Categoria inválida')
    if (!userId) throw new BadRequestException('userId inválida')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Ranking)

    const queryDb = repo
      .createQueryBuilder('Ranking')
      .select()
      .addSelect(['User.id', 'User.name', 'User.email', 'User.image', 'User.gender'])
      .innerJoin('Ranking.user', 'User')
      .where('Ranking.categoryId = :categoryId', { categoryId })

    if (userId) queryDb.andWhere('Ranking.userId IN (:...userId)', { userId: makeArray(userId) })

    const rankings = await queryDb.getMany()

    return { success: true, rankings }
  }

  @Get('/generate')
  @JwtAuthGuard()
  @HttpCode(200)
  async autoGenerate(@Req() req: AuthorizedApiRequest) {
    const { query, auth } = req

    const categoryId = +query?.categoryId || 0
    if (!categoryId) throw new BadRequestException('categoria inválida')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Ranking)
    const repoSub = ds.getRepository(Subscription)

    const rankings = await repo.find({ where: { categoryId } })
    const subscriptions = await repoSub
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Category.id', 'Category.tournamentId'])
      .innerJoin('Subscription.category', 'Category')
      .where(`Subscription.actived = '1' AND Subscription.verified IS NOT NULL AND Subscription.categoryId = :categoryId`, { categoryId })
      .getMany()

    const toCreate: DeepPartial<Ranking>[] = (
      await Promise.all(
        subscriptions.map(async sub => {
          const found = rankings.find(rank => rank.categoryId === sub.categoryId && rank.userId === sub.userId)
          if (!found) {
            const newRank: DeepPartial<Ranking> = {
              categoryId: sub.categoryId,
              tournamentId: sub.category.tournamentId,
              userId: sub.userId,
              createdBy: auth.userId
            }
            return newRank
          }
          return null
        })
      )
    ).filter(f => !!f)

    const created = await repo.save(repo.create(toCreate))

    return { success: true, created }
  }

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

  @Get('/:rankingId')
  @JwtAuthGuard()
  @HttpCode(200)
  async getOne(@Req() req: AuthorizedApiRequest) {
    const { query } = req
    const rankingId = +query?.params[0] || 0
    if (!rankingId) throw new BadRequestException('Ranking inválido')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Ranking)
    const ranking = await repo.findOne({ where: { id: rankingId } })
    if (!ranking) throw new BadRequestException()

    return { success: true, rankingId, ranking }
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
