import { createHandler, Get, HttpCode, Req } from '@storyofams/next-api-decorators'
import { instanceToPlain } from 'class-transformer'
import type { NextApiRequest } from 'next'

import { prepareDataSource } from '~/server-side/database'
import { JwtAuthGuard } from '~/server-side/userCases/auth/middleware'
import { User } from '~/server-side/userCases/user/user.entity'

@JwtAuthGuard()
class UserHandler {
  @Get()
  @HttpCode(200)
  async users(@Req() _req: NextApiRequest) {
    const dataSource = await prepareDataSource()
    const repo = dataSource.getRepository(User)
    const users = await repo.find({ select: { id: true, name: true } })
    return { success: true, users: users.map(u => instanceToPlain(u)) }
  }
}

export default createHandler(UserHandler)
