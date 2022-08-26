import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import { createContext, useContextSelector } from 'use-context-selector'

import type { ICategory } from '~/server-side/useCases/category/category.dto'
import { IResponseCreateSubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import type { IUser } from '~/server-side/useCases/user/user.dto'
import { createSubscription } from '~/services/api/subscriptions'

export interface ISubscriptionProviderContext {
  tournamentId?: number
  category?: ICategory | null
  setCategory: Dispatch<SetStateAction<ICategory>>
  partner?: IUser | null
  setPartner?: Dispatch<SetStateAction<IUser>>
  saveSubscription: () => Promise<IResponseCreateSubscription>
}
const SubscriptionProviderContext = createContext({} as ISubscriptionProviderContext)

type Props = {
  children?: React.ReactNode
  tournamentId: number
}
export const SubscriptionProvider: React.FC<Props> = ({ children, tournamentId }) => {
  const [category, setCategory] = useState<ICategory>(null)
  const [partner, setPartner] = useState<IUser>(null)

  const saveSubscription = useCallback(async () => {
    if (!category || !partner) return null
    const response = await createSubscription({ categoryId: category?.id, partnerId: partner?.id, value: category.price })
    return response
  }, [category, partner])

  return (
    <SubscriptionProviderContext.Provider value={{ tournamentId, category, setCategory, partner, setPartner, saveSubscription }}>
      {children}
    </SubscriptionProviderContext.Provider>
  )
}

export function useSubscription() {
  const tournamentId = useContextSelector(SubscriptionProviderContext, ({ tournamentId }) => tournamentId)
  const [category, setCategory] = useContextSelector(SubscriptionProviderContext, ({ category, setCategory }) => [category, setCategory])
  const [partner, setPartner] = useContextSelector(SubscriptionProviderContext, ({ partner, setPartner }) => [partner, setPartner])
  const saveSubscription = useContextSelector(SubscriptionProviderContext, ({ saveSubscription }) => saveSubscription)

  return { tournamentId, setCategory, category, partner, setPartner, saveSubscription }
}
