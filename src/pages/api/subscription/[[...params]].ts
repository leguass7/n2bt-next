import { BadRequestException, createHandler, HttpCode, HttpException, Post, Req } from '@storyofams/next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

class SubscriptionHandler {
  @Post()
  @JwtAuthGuard()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest<Partial<Subscription>>) {
    const { userId } = req.auth
    if (!userId) throw new BadRequestException('Usuário não encontrado')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const override: Partial<Subscription> = { actived: true, paid: false, createdBy: userId, updatedBy: userId }

    const data = repo.create({ ...req.body, userId, ...override })

    const subscription = await repo.save(data)
    if (!subscription) throw new HttpException(500, 'erro na criação da inscrição')

    return { success: true, subscriptionId: subscription?.id }
  }
}

export default createHandler(SubscriptionHandler)
