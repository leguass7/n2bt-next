import { formatPrice } from '~/helpers'
import { tryDate } from '~/helpers/dates'

import type { ISubscription, ISubscriptionReport, SubscriptionSheetDto } from './subscriptions.dto'

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

export function subscriptionTShirtDto(subscriptions: ISubscription[]): ISubscriptionReport[] {
  const result = subscriptions?.reduce?.((acc, item) => {
    const foundUser = acc.find(({ userId }) => userId === item.userId)
    if (foundUser) {
      foundUser.categoryId.push(item?.categoryId)
      foundUser.category.push(item?.category)
      foundUser.value += item?.value || 0
      foundUser.paid = !!item?.paid
      foundUser.paymentId.push(item.paymentId)
      if (!foundUser?.shirtDelivered) {
        if (!!item?.shirtDelivered) foundUser.shirtDelivered = tryDate(item.shirtDelivered as Date)
      }
      if (!foundUser?.id) foundUser.id = item.id
    } else {
      const data: ISubscriptionReport = {
        userId: item.userId,
        user: item.user,
        categoryId: [item?.categoryId],
        category: [item?.category],
        value: !!item?.paid ? item?.payment?.value || 0 : 0,
        paid: !!item.paid,
        paymentId: [item.paymentId],
        shirtDelivered: tryDate(item.shirtDelivered as Date)
      }
      if (!!data?.shirtDelivered) data.id = item.id
      acc.push(data)
    }

    return acc
  }, [] as ISubscriptionReport[])

  result.forEach(item => {
    if (!item?.id) {
      const found = subscriptions.find(({ userId }) => userId === item.userId)
      item.id = found?.id
    }
  })

  return result
}
