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
  const response = await apiService.get(`/arena`, { params })
  return response
}

export async function updateArena(arenaId: number, data: Partial<IArena>): Promise<IResponseArena> {
  const response = await apiService.patch(`/arena/${arenaId}`, data)
  return response
}

export async function createArena(data: Partial<IArena>): Promise<IResponseArena> {
  const response = await apiService.post(`/arena`, data)
  return response
}

export async function storeArena({ id, ...data }: Partial<IArena>): Promise<IResponseArena> {
  const handler = () => {
    if (id && id > 0) return updateArena(id, data)
    return createArena(data)
  }
  const response = await handler()
  return response
}

export async function deletetArena(arenaId: number): Promise<IResponseArena> {
  const response = await apiService.delete(`/arena/${arenaId}`)
  return response
}
