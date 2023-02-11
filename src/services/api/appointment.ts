import type { NewResponseApi } from '~/server-side/api.interface'
import type { Appointment } from '~/server-side/useCases/appointment/appointment.entity'
import { CreateAppointmentDTO } from '~/server-side/useCases/appointment/dto/create-appointment.dto'
import { FilterAppointmentDTO } from '~/server-side/useCases/appointment/dto/filter-appointment.dto'
import { UpdateAppointmentDTO } from '~/server-side/useCases/appointment/dto/update-appointment.dto'

import { apiService } from './api.service'

export async function listAppointments(filter: FilterAppointmentDTO): Promise<NewResponseApi<Appointment[]>> {
  const params = new URLSearchParams(filter as any).toString()
  const query = params ? `?${params}` : ''

  const response = await apiService.get(`/appointment${query}`)
  return response
}

export async function getAppointment(appointmentId: number) {
  const response = await apiService.get(`/appointment/${appointmentId}`)
  return response
}

export async function createAppointment(dto: CreateAppointmentDTO) {
  const response = await apiService.post(`/appointment`, dto)
  return response
}

export async function updateAppointment(appointmentId: number, dto: UpdateAppointmentDTO) {
  const response = await apiService.patch(`/appointment/${appointmentId}`, dto)
  return response
}
