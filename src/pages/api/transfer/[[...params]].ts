import { BadRequestException, createHandler, HttpCode, Post, Req } from 'next-api-decorators'

import { wait } from '~/helpers'
import { prepareConnection } from '~/server-side/database/conn'
import type { IArena } from '~/server-side/useCases/arena/arena.dto'
import { Arena } from '~/server-side/useCases/arena/arena.entity'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'

class TransferHandler {
  @Post()
  @JwtAuthGuard()
  @HttpCode(200)
  async transfer(@Req() req: AuthorizedApiRequest) {
    const { auth, body } = req
    const { fromId, toId } = body

    const ds = await prepareConnection()
    const repo = ds.getRepository(Arena)

    await wait(1000)

    return { success: true }
  }
}

export default createHandler(TransferHandler)
