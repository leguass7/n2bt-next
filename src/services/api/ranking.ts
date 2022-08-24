import type { IRanking, IResponseUserRanking } from '~/server-side/useCases/ranking/ranking.dto'

import { apiService } from './api.service'

export async function listRankings(categoryId: number): Promise<IResponseUserRanking> {
  const response = await apiService.get(`/ranking/list`, { params: { categoryId } })
  return response
}

export async function createRanking(data: IRanking): Promise<IResponseUserRanking> {
  const response = await apiService.post('/ranking', data)
  return response
}

export async function deleteRanking(id: number): Promise<IResponseUserRanking> {
  const response = await apiService.delete(`/ranking/${id}`)
  return response
}
export async function updateRanking(id: number, data: IRanking): Promise<IResponseUserRanking> {
  const response = await apiService.patch(`/ranking/${id}`, data)
  return response
}

export async function storeRanking({ id, ...data }: IRanking): Promise<IResponseUserRanking> {
  if (id) updateRanking(id, data)
  return createRanking(data)
}
