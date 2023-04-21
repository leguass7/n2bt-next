import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

import type { Appointment } from '../appointment.entity'

export class FilterAppointmentDTO implements Partial<Appointment> {
  @IsOptional()
  @IsNumber()
  fieldId?: number

  @IsOptional()
  @IsString()
  userId?: string

  @IsOptional()
  @IsDate()
  createdAt?: Date

  @IsOptional()
  @IsDate()
  startDate?: Date

  @IsOptional()
  @IsDate()
  endDate?: Date

  @IsOptional()
  @IsBoolean()
  paid?: boolean

  @IsOptional()
  @IsBoolean()
  attendance?: boolean

  @IsOptional()
  @IsBoolean()
  actived?: boolean
}
