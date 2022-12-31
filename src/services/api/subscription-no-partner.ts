import { IResponseSubscriptionNoPartner } from '~/server-side/useCases/subscription-no-partner/subscription-no-partner.dto'
import { SubscriptionNoPartner } from '~/server-side/useCases/subscription-no-partner/subscription-no-partner.entity'

import { apiService } from './api.service'

export async function createSubscriptionNoPartner(data: Partial<SubscriptionNoPartner>): Promise<IResponseSubscriptionNoPartner> {
  const response = await apiService.post('/subscription-no-partner', data)
  return response
}
