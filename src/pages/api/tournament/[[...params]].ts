import { BadRequestException, createHandler, Delete, Get, HttpCode, Param, Patch, Post, Req } from 'next-api-decorators'
import { FindOptionsWhere } from 'typeorm'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { PaginateService } from '~/server-side/services/PaginateService'
import { Pagination } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { IfAuth, JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { Tournament } from '~/server-side/useCases/tournament/tournament.entity'

const searchFields = ['id', 'title']
const orderFields = [
  ['Tournament.id', 'id'],
  ['Tournament.title', 'title']
]

class TournamentHandler {
  @Get('/list')
  @Pagination()
  @HttpCode(200)
  async list(@Req() req: AuthorizedPaginationApiRequest) {
    const { order, size = 1000 } = req?.pagination
    const ds = await prepareConnection()
    const repo = ds.getRepository(Tournament)

    const queryDb = repo
      .createQueryBuilder('Tournament')
      .select()
      .addSelect(['Arena.id', 'Arena.title'])
      .innerJoin('Tournament.arena', 'Arena')
      .where({ published: true })
      .take(size)

    parseOrderDto({ order, table: 'Tournament', orderFields }).querySetup(queryDb)

    const tournaments = await queryDb.getMany()

    return { success: true, tournaments }
  }

  // @Get('/report/:tournamentId')
  // @JwtAuthGuard()
  // async report(@Param('tournamentId') tournamentId: number) {
  //   const ds = await prepareConnection()
  //   const repo = ds.getRepository(Tournament)

  //   const tournament = await repo.findOne({ where: { id: tournamentId }, relations: ['payments'] })
  //   const payments = tournament.payments

  //   const paid = payments.filter(pay => !!pay?.paid)
  //   const notPaid = payments.filter(pay => !pay?.paid)

  //   return { paid, notPaid }
  // }

  @Get('/:tournamentId')
  @IfAuth()
  @HttpCode(200)
  async one(@Req() req: AuthorizedApiRequest) {
    const { auth, query } = req
    const tournamentId = +query?.params[0] || 0

    const ds = await prepareConnection()
    const repo = ds.getRepository(Tournament)
    const where: FindOptionsWhere<Tournament> = { id: tournamentId }
    if (auth?.level <= 8) where.published = true

    const tournament = await repo.findOne({ where, relations: ['arena'] })
    if (!tournament) throw new BadRequestException()

    return { success: true, tournament }
  }

  @Patch('/:tournamentId')
  @JwtAuthGuard()
  @HttpCode(200)
  async update(@Req() req: AuthorizedApiRequest) {
    const { auth, query, body } = req
    const tournamentId = +query?.params[0] || 0
    if (!tournamentId) throw new BadRequestException()

    const ds = await prepareConnection()
    const repo = ds.getRepository(Tournament)
    const tournament = await repo.update(tournamentId, { ...body, updatedAt: new Date(), updatedBy: auth.userId })
    if (!tournament) throw new BadRequestException()

    return { success: true, tournamentId, affected: tournament?.affected }
  }

  @Delete('/:tournamentId')
  @JwtAuthGuard()
  @HttpCode(200)
  async remove(@Req() req: AuthorizedApiRequest) {
    const { query } = req
    const tournamentId = +query?.params[0] || 0
    if (!tournamentId) throw new BadRequestException()

    const ds = await prepareConnection()
    const repo = ds.getRepository(Tournament)
    const deleted = await repo.delete(tournamentId)
    if (!deleted) throw new BadRequestException()

    return { success: true, tournamentId, affected: deleted?.affected }
  }

  @Get()
  @JwtAuthGuard()
  @HttpCode(200)
  @Pagination()
  async paginate(@Req() req: AuthorizedPaginationApiRequest) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(Tournament)

    const arenaId = +req?.query?.arenaId
    if (!arenaId) throw new BadRequestException('not_found_arenaId')

    const { search, order } = req.pagination
    const queryText = search ? searchFields.map(field => `Tournament.${field} LIKE :search`) : null

    const queryDb = repo.createQueryBuilder('Tournament').select().where({ arenaId })

    if (queryText) queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'Tournament', orderFields }).querySetup(queryDb)

    const paginateService = new PaginateService('tournament')
    const paginated = await paginateService.paginate(queryDb, req.pagination)
    return { success: true, ...paginated }
  }

  @Post()
  @JwtAuthGuard()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest) {
    const { auth, body } = req

    const ds = await prepareConnection()
    const repo = ds.getRepository(Tournament)
    const data = { ...body, createdAt: new Date(), createdBy: auth.userId, userId: auth.userId } as ITournament
    const saveData = repo.create(data)
    const created = await repo.save(saveData)
    if (!created) throw new BadRequestException()

    return { success: true, tournamentId: created?.id, arena: created }
  }
}

export default createHandler(TournamentHandler)
