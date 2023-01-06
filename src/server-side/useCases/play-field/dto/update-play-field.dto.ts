import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'

import type { PlayField } from '../play-field.entity'

export class UpdatePlayFieldDTO implements Partial<PlayField> {
  @IsString()
  @IsOptional()
  label?: string

  @IsNumber()
  @IsOptional()
  price?: number

  @IsInt()
  @IsOptional()
  appointmentLimit?: number

  @IsOptional()
  @IsBoolean()
  actived?: boolean

  @IsBoolean()
  @IsOptional()
  paid?: boolean

  @IsDate()
  @IsOptional()
  startDate?: Date

  @IsDate()
  @IsOptional()
  endDate?: Date

  @IsInt()
  @IsOptional()
  breakInMinutes?: number

  @IsInt()
  @IsOptional()
  arenaId?: number

  @IsString()
  @IsOptional()
  createdBy?: string

  @IsString()
  @IsOptional()
  updatedBy?: string
}
