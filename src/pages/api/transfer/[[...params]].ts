import { BadRequestException, createHandler, HttpCode, Post, Req } from 'next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { Checkin } from '~/server-side/useCases/checkin/checkin.entity'
import { Payment } from '~/server-side/useCases/payment/payment.entity'
import { Ranking } from '~/server-side/useCases/ranking/ranking.entity'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

class TransferHandler {
  @Post()
  @JwtAuthGuard()
  @HttpCode(200)
  async transfer(@Req() req: AuthorizedApiRequest) {
    const { body } = req
    const { fromId, toId } = body

    if (!fromId || !toId) throw new BadRequestException('invalid ids')

    const ds = await prepareConnection()

    // tranferir inscrições
    await ds.transaction(async transDS => {
      await transDS.createQueryBuilder().update(Subscription).set({ userId: toId }).where({ userId: fromId }).execute()
      await transDS.createQueryBuilder().update(Subscription).set({ partnerId: toId }).where({ partnerId: fromId }).execute()
      await transDS.createQueryBuilder().update(Subscription).set({ createdBy: toId }).where({ createdBy: fromId }).execute()
      await transDS.createQueryBuilder().update(Subscription).set({ updatedBy: toId }).where({ updatedBy: fromId }).execute()

      await transDS.createQueryBuilder().update(Payment).set({ userId: toId }).where({ userId: fromId }).execute()
      await transDS.createQueryBuilder().update(Payment).set({ createdBy: toId }).where({ createdBy: fromId }).execute()
      await transDS.createQueryBuilder().update(Payment).set({ updatedBy: toId }).where({ updatedBy: fromId }).execute()

      await transDS.createQueryBuilder().update(Checkin).set({ userId: toId }).where({ userId: fromId }).execute()
      await transDS.createQueryBuilder().update(Checkin).set({ createdBy: toId }).where({ createdBy: fromId }).execute()

      await transDS.createQueryBuilder().update(Ranking).set({ userId: toId }).where({ userId: fromId }).execute()
      await transDS.createQueryBuilder().update(Ranking).set({ createdBy: toId }).where({ createdBy: fromId }).execute()
    })

    // await wait(1000)

    return { success: true }
  }
}

export default createHandler(TransferHandler)
