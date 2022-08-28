import type { IResponseSubscriptions } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import type { IResponseUser } from '~/server-side/useCases/user/user.dto'

import { apiService } from '../api.service'

export async function listMeSubscriptions(): Promise<IResponseSubscriptions> {
  const response = await apiService.get('/me/subscription')
  return response
}

export async function getMe(): Promise<IResponseUser> {
  const response = await apiService.get('/me')
  return response
}
