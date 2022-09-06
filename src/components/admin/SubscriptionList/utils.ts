import { compareValues } from '~/helpers/array'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import type { IUser } from '~/server-side/useCases/user/user.dto'

export type PreparedSubscription = ISubscription & { key?: string; pair?: ISubscription }

export function prepareDto1(data: ISubscription[]): PreparedSubscription[] {
  const withPartner = data.filter(f => !!f?.partner)
  // const withoutPartner = data.filter(f => !f?.partner)

  const result: PreparedSubscription[] = []

  withPartner.forEach(({ partner, ...sub }) => {
    const has = result.find(f => f.userId === sub.userId || f.userId === sub.partnerId)
    // const has = result.find(f => f.userId === sub.userId)
    if (has) return
    const add: PreparedSubscription = { ...sub, partner, key: `sub-${sub.id}` }
    const foundPair = data.find(f => {
      return f.categoryId === sub.categoryId && f.userId === sub.partnerId && f.partnerId === sub.userId
    })
    if (foundPair) {
      add.key = `sub-${sub.id}-${foundPair.id}`
      add.pair = foundPair
    }

    result.push(add)
  })

  return result.sort(compareValues('id', 'asc'))
}

export type Pair = {
  id: string
  categoryId: number
  userId: string
  partnerId: string
  userSubscription: ISubscription
  partnerSubscription?: ISubscription
}

export function prepareDto(data: ISubscription[] = []): Pair[] {
  const result: Pair[] = []
  const arrRef = [...data.sort(compareValues('id', 'asc'))]

  const findSubscriptionByUserId = (id: string, catId: number) => {
    return data.find(f => f.categoryId === catId && f.userId === id)
  }

  arrRef?.forEach(({ categoryId, userId, partnerId, ...subscription }) => {
    const foudByUser = result.find(f => f.categoryId === categoryId && f.userId === userId)
    if (!foudByUser) {
      const foundByPartner = result.find(f => f.categoryId === categoryId && f.partnerId === userId)
      if (!foundByPartner) {
        const partnerSubscription = findSubscriptionByUserId(partnerId, categoryId)
        result.push({
          categoryId,
          userId,
          partnerId,
          userSubscription: { categoryId, userId, partnerId, ...subscription },
          partnerSubscription,
          id: `tempkey-${subscription?.id}-${partnerSubscription?.id}`
        })
      }
    }
  })

  return result
}
