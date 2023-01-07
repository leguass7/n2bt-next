import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator'

import type { Appointment } from '../appointment.entity'

export class UpdateAppointmentDTO implements Partial<Appointment> {
  @IsOptional()
  @IsString()
  userId?: string

  @IsOptional()
  @IsNumber()
  fieldId: number

  @IsOptional()
  @IsDate()
  startDate: Date

  @IsOptional()
  @IsDate()
  endDate: Date

  @IsOptional()
  @IsBoolean()
  attendance?: boolean

  @IsOptional()
  @IsBoolean()
  actived?: boolean

  @IsOptional()
  @IsBoolean()
  paid?: boolean
}
