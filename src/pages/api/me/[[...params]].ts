import { BadRequestException, createHandler, Get, HttpCode, Patch, Req } from '@storyofams/next-api-decorators'
import { instanceToPlain } from 'class-transformer'
import { parseISO } from 'date-fns'

import { prepareConnection } from '~/server-side/database/conn'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { IUser } from '~/server-side/useCases/user/user.dto'
import { User } from '~/server-side/useCases/user/user.entity'

// const searchFields = ['id', 'name', 'email', 'cpf', 'phone', 'nick']
// const otherSearch = ['Category.title']
// const orderFields = [
//   ['User.id', 'id'],
//   ['User.name', 'name'],
//   ['User.nick', 'nick']
// ]

class MeHandler {
  @Patch()
  @JwtAuthGuard()
  @HttpCode(201)
  async saveMe(@Req() req: AuthorizedApiRequest<IUser>) {
    const { auth } = req
    const ds = await prepareConnection()
    const repo = ds.getRepository(User)
    const userId = auth?.userId
    const { birday, ...data } = req?.body

    const u: Partial<IUser> = { ...data }
    if (birday) u.birday = parseISO(`${birday}`)

    if (!userId) throw new BadRequestException('Usuário não encontrado')
    const user = await repo.update(userId, u)

    return { success: !!user, userId }
  }

  @Get('/me')
  @JwtAuthGuard()
  @HttpCode(200)
  async me(@Req() req: AuthorizedApiRequest) {
    const { auth } = req
    const userId = auth?.userId

    const ds = await prepareConnection()
    const repo = ds.getRepository(User)
    const user = await repo.findOne({ where: { id: userId } })
    if (!user) throw new BadRequestException()

    return { success: true, user: instanceToPlain(user) }
  }
}

export default createHandler(MeHandler)
