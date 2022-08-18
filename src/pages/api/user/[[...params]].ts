import { BadRequestException, createHandler, Get, HttpCode, Req } from '@storyofams/next-api-decorators'
import { instanceToPlain } from 'class-transformer'

import { prepareDataSource } from '~/server-side/database'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { User } from '~/server-side/useCases/user/user.entity'

class UserHandler {
  @Get()
  @HttpCode(200)
  @JwtAuthGuard()
  async users(@Req() _req: AuthorizedApiRequest) {
    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(User)
    const users = await repo.find({ select: { id: true, name: true } })
    return { success: true, users: users.map(u => instanceToPlain(u)) }
  }

  @Get('/me')
  @HttpCode(200)
  @JwtAuthGuard()
  async me(@Req() req: AuthorizedApiRequest) {
    const { auth } = req
    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(User)
    const user = await repo.findOne({ where: { id: auth.userId } })
    if (!user) throw new BadRequestException()

    return { success: true, user: instanceToPlain(user) }
  }
}

export default createHandler(UserHandler)
