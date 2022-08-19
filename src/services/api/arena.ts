import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { IArena, IResponseArena, IResponseArenas } from '~/server-side/useCases/arena/arena.dto'
import { apiService } from '~/services/api/api.service'

export async function getArena(arenaId: number): Promise<IResponseArena> {
  const response = await apiService.get(`/arena/${arenaId}`)
  return response
}

export async function listArenas(): Promise<IResponseArenas> {
  const response = await apiService.get(`/arena/list`)
  return response
}

export async function paginateArenas(params: TableFetchParams = {}): Promise<IResponsePaginated<IArena>> {
  const response = await apiService.get(`/arena/list`, { params })
  return response
}
