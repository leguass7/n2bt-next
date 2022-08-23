import type { IResponseCategories } from '~/server-side/useCases/category/category.dto'

import { apiService } from './api.service'

export async function listCategories(tournamentId: number): Promise<IResponseCategories> {
  const response = await apiService.get(`/category/list`, { params: { tournamentId } })
  return response
}
