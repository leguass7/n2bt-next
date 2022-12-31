import { BadRequestException, createHandler, HttpCode, HttpException, Post, Req } from 'next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { SubscriptionNoPartner } from '~/server-side/useCases/subscription-no-partner/subscription-no-partner.entity'

class SubscriptionNoPartnerHandler {
  @Post()
  @JwtAuthGuard()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest<Partial<SubscriptionNoPartner>>) {
    const { body, auth } = req
    const currentUserId = auth?.userId
    const isAdmin = !!(auth?.level >= 8)
    if (!currentUserId) throw new BadRequestException('Usuário não encontrado')

    const ds = await prepareConnection()
    const repo = ds.getRepository(SubscriptionNoPartner)

    const { categoryId, value, paid } = body
    const userId = isAdmin ? body?.userId ?? currentUserId : currentUserId

    const newSubscription: Partial<SubscriptionNoPartner> = {
      actived: true,
      paid: isAdmin ? !!paid : false,
      categoryId,
      userId,
      value
    }

    const hasSubscriptionNoPartner = await repo.findOne({ where: { categoryId, userId: isAdmin ? userId : currentUserId, actived: true } })
    if (hasSubscriptionNoPartner) {
      await repo.update(hasSubscriptionNoPartner.id, { actived: false, updatedBy: currentUserId })
    }

    const data = repo.create(newSubscription)
    const subscriptionNoParter = await repo.save(data)
    if (!subscriptionNoParter) throw new HttpException(500, 'erro na criação da inscrição')

    return { success: true, subscription: subscriptionNoParter }
  }
}

export default createHandler(SubscriptionNoPartnerHandler)
