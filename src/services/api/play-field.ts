import { CreatePlayFieldDTO } from '~/server-side/useCases/play-field/dto/create-play-field.dto'
import { FilterPlayFieldDTO } from '~/server-side/useCases/play-field/dto/filter-play-field.dto'
import { UpdatePlayFieldDTO } from '~/server-side/useCases/play-field/dto/update-play-field.dto'

import { apiService } from './api.service'

export async function createPlayField(dto: CreatePlayFieldDTO) {
  const response = await apiService.post(`/play-field`, dto)
  return response
}

export async function updatePlayField(dto: UpdatePlayFieldDTO) {
  const response = await apiService.patch(`/play-field`, dto)
  return response
}

export async function listPlayFieldInArena(arenaId: number, filter: FilterPlayFieldDTO = {}) {
  const params = new URLSearchParams(filter as any)
  const query = params ? `?${params}` : ''

  const response = await apiService.get(`/play-field$/${arenaId}${query}`)
  return response
}

export async function getPlayField(fieldId: number) {
  const response = await apiService.get(`/play-field$/${fieldId}`)
  return response
}
