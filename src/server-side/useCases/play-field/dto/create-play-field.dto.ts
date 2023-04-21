import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

import type { PlayField } from '../play-field.entity'

export class CreatePlayFieldDTO implements Partial<PlayField> {
  @IsNotEmpty()
  @IsString()
  label: string

  @IsOptional()
  @IsBoolean()
  actived?: boolean

  @IsOptional()
  @IsNumber()
  price?: number

  @IsNotEmpty()
  @IsDate()
  startDate: Date

  @IsNotEmpty()
  @IsDate()
  endDate: Date

  @IsNotEmpty()
  @IsInt()
  interval: number

  @IsNotEmpty()
  @IsInt()
  arenaId: number

  @IsOptional()
  @IsString()
  createdBy: string

  @IsOptional()
  @IsString()
  updatedBy: string
}
