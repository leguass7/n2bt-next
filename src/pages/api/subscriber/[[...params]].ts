// import type { NextApiResponse } from 'next'
import { BadRequestException, createHandler, HttpCode, HttpException, Post, Req } from 'next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

class SubscriberHandler {
  @Post()
  @JwtAuthGuard()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest<Partial<Subscription>>) {
    const { body, auth } = req
    const currentUserId = auth?.userId
    if (!currentUserId) throw new BadRequestException('Usuário não encontrado')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const { categoryId, partnerId, value } = body

    const newSubscription: Partial<Subscription> = {
      actived: true,
      paid: false,
      categoryId,
      partnerId,
      userId: currentUserId,
      value
    }

    const hasSubscription = await repo.findOne({ where: { categoryId, userId: currentUserId, actived: true } })
    if (hasSubscription) {
      await repo.update(hasSubscription.id, { actived: false, updatedBy: currentUserId })
    }

    const data = repo.create(newSubscription)
    const subscription = await repo.save(data)
    if (!subscription) throw new HttpException(500, 'erro na criação da inscrição')

    return { success: true, subscriptionId: subscription?.id, subscription }
  }
}

export default createHandler(SubscriberHandler)
