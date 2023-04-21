import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

import type { Appointment } from '../appointment.entity'

export class CreateAppointmentDTO implements Partial<Appointment> {
  @IsOptional()
  @IsString()
  userId?: string

  @IsNotEmpty()
  @IsNumber()
  fieldId: number

  @IsNotEmpty()
  @IsDate()
  startDate: Date

  @IsNotEmpty()
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
