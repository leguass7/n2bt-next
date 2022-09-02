import type { TableFetchParams } from '~/components/CustomTable/types'
import { querystring } from '~/helpers/string'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { IResponseUser, IResponseUsers, IResponseUserStore, IUser } from '~/server-side/useCases/user/user.dto'

import { apiService } from '../api.service'

export async function findOneUser(data: IUser): Promise<IResponseUser> {
  const query = querystring({ ...data })
  const response = await apiService.get(`/user/find-one?${query}`)
  return response
}

export async function saveMe(data: IUser): Promise<IResponseUserStore> {
  const response = await apiService.patch('/user', data)
  return response
}

export async function createUser(data: IUser): Promise<IResponseUserStore> {
  const response = await apiService.post('/user/register', data)
  return response
}

export async function updateUser(userId: string, data: IUser): Promise<IResponseUserStore> {
  const response = await apiService.patch(`/user/${userId}`, data)
  return response
}

export async function paginateUsers(params: TableFetchParams = {}): Promise<IResponsePaginated<IUser>> {
  const response = await apiService.get('/user', { params })
  return response
}

export async function findUser(params: any = {}): Promise<IResponseUsers> {
  const response = await apiService.get('/user/find', { params })
  return response
}
