import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'

import type { PlayField } from '../play-field.entity'

export class UpdatePlayFieldDTO implements Partial<PlayField> {
  @IsString()
  @IsOptional()
  label?: string

  @IsNumber()
  @IsOptional()
  price?: number

  @IsOptional()
  @IsBoolean()
  actived?: boolean

  @IsDate()
  @IsOptional()
  startDate?: Date

  @IsDate()
  @IsOptional()
  endDate?: Date

  @IsInt()
  @IsOptional()
  interval?: number

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
