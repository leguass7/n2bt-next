import { BadRequestException, createHandler, Delete, Get, HttpCode, Patch, Post, Req } from '@storyofams/next-api-decorators'
import type { NextApiRequest } from 'next'
import { FindOptionsWhere } from 'typeorm'

import { prepareDataSource } from '~/server-side/database'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { PaginateService } from '~/server-side/services/PaginateService'
import { Pagination } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { IfAuth, JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { Tournament } from '~/server-side/useCases/tournament/tournament.entity'

const searchFields = ['id', 'name']
const orderFields = [
  ['Tournament.id', 'id'],
  ['Tournament.name', 'name']
]

class TournamentHandler {
  @Get('/list')
  @HttpCode(200)
  async list(@Req() _req: NextApiRequest) {
    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(Tournament)
    const tournaments = await repo.find({ select: { id: true, title: true }, where: { published: true } })
    return { success: true, tournaments }
  }

  @Get('/:tournamentId')
  @IfAuth()
  @HttpCode(200)
  async one(@Req() req: AuthorizedApiRequest) {
    const { auth, query } = req
    const tournamentId = +query?.params[0] || 0

    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(Tournament)
    const where: FindOptionsWhere<Tournament> = { id: tournamentId }
    if (auth?.level <= 8) where.published = true

    const tournament = await repo.findOne({ where })
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

    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(Tournament)
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

    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(Tournament)
    const deleted = await repo.delete(tournamentId)
    if (!deleted) throw new BadRequestException()

    return { success: true, tournamentId, affected: deleted?.affected }
  }

  @Get()
  @HttpCode(200)
  @Pagination()
  async paginate(@Req() req: AuthorizedPaginationApiRequest) {
    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(Tournament)

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

    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(Tournament)
    const data = { ...body, createdAt: new Date(), createdBy: auth.userId, userId: auth.userId } as ITournament
    const saveData = repo.create(data)
    const created = await repo.save(saveData)
    if (!created) throw new BadRequestException()

    return { success: true, tournamentId: created?.id, arena: created }
  }
}

export default createHandler(TournamentHandler)
