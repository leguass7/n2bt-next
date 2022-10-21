import type { IResponseApi } from '~/server-side/api.interface'

import { apiService } from './api.service'

export async function createTranfering(fromId: string, toId: string): Promise<IResponseApi> {
  const response = await apiService.post(`/transfer`, { fromId, toId })
  return response
}
