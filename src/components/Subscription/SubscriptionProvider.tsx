import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { createContext, useContextSelector } from 'use-context-selector'

import type { ICategory } from '~/server-side/useCases/category/category.dto'
import type { IResponseGeneratePix } from '~/server-side/useCases/payment/payment.dto'
import type { IResponseSubscription, ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import type { IUser } from '~/server-side/useCases/user/user.dto'
import { PaymentPayload, generatePayment } from '~/services/api/payment'
import { createPublicSubscription } from '~/services/api/subscriber'

export interface ISubscriptionProviderContext {
  subscription: ISubscription
  maxSubscription: number
  setSubscription: Dispatch<SetStateAction<ISubscription>>
  tournamentId?: number
  category?: ICategory | null
  setCategory: Dispatch<SetStateAction<ICategory>>
  partner?: IUser | null
  setPartner?: Dispatch<SetStateAction<IUser>>
  saveSubscription: (noPartner?: boolean) => Promise<IResponseSubscription>
  generatePixPayment: (subId: number) => Promise<IResponseGeneratePix>
  payment?: IResponseGeneratePix
  setPayment?: Dispatch<SetStateAction<IResponseGeneratePix>>
  clearSubscription: () => void
  paymentPayload?: PaymentPayload
  setPaymentPayload?: Dispatch<SetStateAction<PaymentPayload>>
}
const SubscriptionProviderContext = createContext({} as ISubscriptionProviderContext)

type Props = {
  children?: React.ReactNode
  tournamentId: number
  maxSubscription?: number
}

export const SubscriptionProvider: React.FC<Props> = ({ children, tournamentId, maxSubscription }) => {
  const [category, setCategory] = useState<ICategory>(null)
  const [partner, setPartner] = useState<IUser>(null)
  const [subscription, setSubscription] = useState<ISubscription>(null)
  const [payment, setPayment] = useState<IResponseGeneratePix>(null)
  const [paymentPayload, setPaymentPayload] = useState(null)

  const clearSubscription = useCallback(() => {
    setPayment(null)
    setSubscription(null)
    setPartner(null)
    setCategory(null)
  }, [])

  const saveSubscription = useCallback(
    async (noPartner = false) => {
      const requiredPartner = !noPartner && !partner
      if (!category || requiredPartner) return null

      const response = await createPublicSubscription({ categoryId: category?.id, partnerId: partner?.id, value: category.price })

      if (response?.success) setSubscription(response?.subscription)
      else toast.error(response?.message || 'Erro ao gerar inscrição')

      return response
    },
    [category, partner]
  )

  const generatePixPayment = useCallback(
    async (subId: number) => {
      const response = await generatePayment(subId, { ...paymentPayload })
      if (response.success) setPayment(response)
      return response
    },
    [paymentPayload]
  )

  return (
    <SubscriptionProviderContext.Provider
      value={{
        tournamentId,
        maxSubscription,
        category,
        setCategory,
        partner,
        setPartner,
        saveSubscription,
        generatePixPayment,
        subscription,
        setSubscription,
        payment,
        setPayment,
        clearSubscription,
        paymentPayload,
        setPaymentPayload
      }}
    >
      {children}
    </SubscriptionProviderContext.Provider>
  )
}

export function useSubscription() {
  const tournamentId = useContextSelector(SubscriptionProviderContext, ({ tournamentId }) => tournamentId)
  const [category, setCategory] = useContextSelector(SubscriptionProviderContext, ({ category, setCategory }) => [category, setCategory])
  const [partner, setPartner] = useContextSelector(SubscriptionProviderContext, ({ partner, setPartner }) => [partner, setPartner])
  const [payment, setPayment] = useContextSelector(SubscriptionProviderContext, ({ payment, setPayment }) => [payment, setPayment])
  const [subscription, setSubscription] = useContextSelector(SubscriptionProviderContext, ({ subscription, setSubscription }) => [
    subscription,
    setSubscription
  ])
  const [paymentPayload, setPaymentPayload] = useContextSelector(SubscriptionProviderContext, ({ paymentPayload, setPaymentPayload }) => [
    paymentPayload,
    setPaymentPayload
  ])

  const saveSubscription = useContextSelector(SubscriptionProviderContext, ({ saveSubscription }) => saveSubscription)
  const generatePixPayment = useContextSelector(SubscriptionProviderContext, ({ generatePixPayment }) => generatePixPayment)
  const clearSubscription = useContextSelector(SubscriptionProviderContext, ({ clearSubscription }) => clearSubscription)
  const maxSubscription = useContextSelector(SubscriptionProviderContext, ({ maxSubscription }) => maxSubscription)

  return {
    tournamentId,
    maxSubscription,
    setCategory,
    category,
    partner,
    setPartner,
    saveSubscription,
    generatePixPayment,
    subscription,
    setSubscription,
    payment,
    setPayment,
    clearSubscription,
    paymentPayload,
    setPaymentPayload
  }
}
