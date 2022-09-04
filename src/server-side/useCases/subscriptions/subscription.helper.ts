import { formatPrice } from '~/helpers'

import type { ISubscription, SubscriptionSheetDto } from './subscriptions.dto'

export function subscriptionToSheetDto(data: ISubscription): SubscriptionSheetDto {
  const { user, paid, category, paymentId, value } = data
  return {
    category: category?.title,
    paid: paid ? 'yes' : 'no',
    paymentId,
    gender: user?.gender,
    name: user?.name,
    phone: user?.phone,
    amount: formatPrice(value),
    shirtSize: user?.shirtSize || ''
  }
}
