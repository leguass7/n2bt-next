import type { IResponseUserRanking } from '~/server-side/useCases/ranking/ranking.dto'

import { apiService } from './api.service'

export async function listRankings(categoryId: number): Promise<IResponseUserRanking> {
  const response = await apiService.get(`/ranking/list`, { params: { categoryId } })
  return response
}
