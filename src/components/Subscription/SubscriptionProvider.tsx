import { Dispatch, SetStateAction, useState } from 'react'

import { createContext, useContextSelector } from 'use-context-selector'

import type { ICategory } from '~/server-side/useCases/category/category.dto'
import type { IUser } from '~/server-side/useCases/user/user.dto'

export interface ISubscriptionProviderContext {
  tournamentId?: number
  category?: ICategory | null
  setCategory: Dispatch<SetStateAction<ICategory>>
  partner?: IUser | null
  setPartner?: Dispatch<SetStateAction<IUser>>
}
const SubscriptionProviderContext = createContext({} as ISubscriptionProviderContext)

type Props = {
  children?: React.ReactNode
  tournamentId: number
}
export const SubscriptionProvider: React.FC<Props> = ({ children, tournamentId }) => {
  const [category, setCategory] = useState<ICategory>(null)
  const [partner, setPartner] = useState<IUser>(null)
  return (
    <SubscriptionProviderContext.Provider value={{ tournamentId, category, setCategory, partner, setPartner }}>
      {children}
    </SubscriptionProviderContext.Provider>
  )
}

export function useSubscription() {
  const tournamentId = useContextSelector(SubscriptionProviderContext, ({ tournamentId }) => tournamentId)
  const [category, setCategory] = useContextSelector(SubscriptionProviderContext, ({ category, setCategory }) => [category, setCategory])
  const [partner, setPartner] = useContextSelector(SubscriptionProviderContext, ({ partner, setPartner }) => [partner, setPartner])

  return { tournamentId, setCategory, category, partner, setPartner }
}
