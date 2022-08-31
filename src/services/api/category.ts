import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { ICategory, IResponseCategories, IResponseCategory } from '~/server-side/useCases/category/category.dto'

import { apiService } from './api.service'

export async function listCategories(tournamentId: number, params: TableFetchParams = {}): Promise<IResponseCategories> {
  const response = await apiService.get(`/category/list`, { params: { ...params, tournamentId } })
  return response
}

export async function listCategoriesSub(tournamentId: number): Promise<IResponseCategories> {
  const response = await apiService.get(`/category/list-sub`, { params: { tournamentId } })
  return response
}

export async function paginateCategories(tournamentId: number, params: TableFetchParams = {}): Promise<IResponsePaginated<ICategory>> {
  const response = await apiService.get(`/category`, { params: { tournamentId, ...params } })
  return response
}

export async function getCategory(categoryId: number): Promise<IResponseCategory> {
  const response = await apiService.get(`/category/${categoryId}`)
  return response
}

export async function updateCategory(categoryId: number, data: Partial<ICategory>): Promise<IResponseCategory> {
  const response = await apiService.patch(`/category/${categoryId}`, data)
  return response
}

export async function createCategory(data: Partial<ICategory>): Promise<IResponseCategory> {
  const response = await apiService.post(`/category`, data)
  return response
}

export async function storeCategory({ id, ...data }: Partial<ICategory>): Promise<IResponseCategory> {
  const handler = () => {
    if (id && id > 0) return updateCategory(id, data)
    return createCategory(data)
  }
  const response = await handler()
  return response
}

export async function deletetCategory(categoryId: number): Promise<IResponseCategory> {
  const response = await apiService.delete(`/category/${categoryId}`)
  return response
}
