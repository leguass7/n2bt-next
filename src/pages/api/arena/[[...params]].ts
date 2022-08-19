import { BadRequestException, createHandler, Get, HttpCode, Req } from '@storyofams/next-api-decorators'
import type { NextApiRequest } from 'next'

import { prepareDataSource } from '~/server-side/database'
import { Arena } from '~/server-side/useCases/arena/arena.entity'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'

class ArenaHandler {
  @Get('/list')
  @HttpCode(200)
  async list(@Req() _req: NextApiRequest) {
    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(Arena)
    const arenas = await repo.find({ select: { id: true, title: true }, where: { published: true } })
    return { success: true, arenas }
  }

  @Get('/:arenaId')
  @HttpCode(200)
  async one(@Req() req: AuthorizedApiRequest) {
    const { auth, query } = req
    const arenaId = +query?.arenaId || 0

    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(Arena)
    const arena = await repo.findOne({ where: { id: arenaId, published: auth?.level <= 8 ? undefined : true } })
    if (!arena) throw new BadRequestException()

    return { success: true, arena }
  }
}

export default createHandler(ArenaHandler)
