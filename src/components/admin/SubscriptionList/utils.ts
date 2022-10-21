import { compareValues } from '~/helpers/array'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

export type PreparedSubscription = ISubscription & { key?: string; pair?: ISubscription }

export type Pair = {
  id: string
  categoryId: number
  userId: string
  partnerId: string
  userSubscription: ISubscription
  partnerSubscription?: ISubscription
}

export function prepareDto(data: ISubscription[] = []): Pair[] {
  const pairs: Pair[] = []

  let dataf = data.sort(compareValues('id', 'asc')).map(f => ({ ...f }))

  const findSubscriptionByUserId = (id: string, catId: number) => {
    const found = dataf.sort(compareValues('id', 'asc')).find(f => !!(f.categoryId === catId && f.userId === id))
    dataf = dataf.filter(f => !!(f.categoryId === catId && f.userId !== id))
    const result = found ? Object.assign({}, { ...found }) : null
    return result
  }

  data.sort(compareValues('id', 'asc')).forEach(({ categoryId, userId, partnerId, ...subscription }) => {
    const foudByUser = pairs.find(f => f.categoryId === categoryId && f.userId === userId)
    if (!foudByUser) {
      const foundByPartner = pairs.find(f => f.categoryId === categoryId && f.partnerId === userId)
      if (!foundByPartner) {
        const partnerSubscription = findSubscriptionByUserId(partnerId, categoryId)
        const n: Pair = {
          categoryId,
          userId,
          partnerId,
          userSubscription: { categoryId, userId, partnerId, ...subscription },
          partnerSubscription: partnerSubscription || undefined,
          id: `tempkey-${subscription?.id}${partnerSubscription?.id ? `-${partnerSubscription.id}` : ''}`
        }
        pairs.push(n)
      } else {
        //
      }
    }
  })

  return pairs
}
