import { compareValues } from '~/helpers/array'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

export type PreparedSubscription = ISubscription & { key?: string; pair?: ISubscription }

export function prepareDto(data: ISubscription[]): PreparedSubscription[] {
  const withPartner = data.filter(f => !!f?.partner)
  // const withoutPartner = data.filter(f => !f?.partner)

  const result: PreparedSubscription[] = []

  withPartner.forEach(({ partner, ...sub }) => {
    const has = result.find(f => f.userId === sub.userId || f.userId === sub.partnerId)
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
