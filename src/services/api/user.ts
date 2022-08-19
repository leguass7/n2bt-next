import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { IResponseUser, IUser } from '~/server-side/useCases/user/user.dto'

import { apiService } from './api.service'

// export async function saveUser(data: IUser): Promise<IResponseUserStore> {
//   const response = await apiService.patch('/user', data)
//   return response
// }

// export async function createUser(data: IUser): Promise<IResponseUserStore> {
//   const response = await apiService.post('/user/register', data)
//   return response
// }

export async function getMe(): Promise<IResponseUser> {
  const response = await apiService.get('/user/me')
  return response
}

export async function paginateUsers(params: TableFetchParams = {}): Promise<IResponsePaginated<IUser>> {
  const response = await apiService.get('/user', { params })
  return response
}

// export async function checkLogin(email: string, password: string): Promise<IResponseCheckUser> {
//   const response = await apiService.post('/user/login', { email, password })
//   return response
// }

// export async function findPartner(params: any = {}): Promise<IResponseUsers> {
//   const response = await apiService.get('/user/find', { params })
//   return response
// }

// export async function forgotPass(email: string): Promise<IResponseUsers> {
//   const response = await apiService.post('/user/forgot', { email })
//   return response
// }

// export async function getFileByDownload(params: QueryPagination = {}) {
//   const response = await apiService.getFileByDownload('/admin/users/download', params)
//   return response || null
// }
