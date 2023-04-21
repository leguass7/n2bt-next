import { IsBoolean, IsDate, IsOptional } from 'class-validator'

import type { PlayField } from '../play-field.entity'

export class FilterPlayFieldDTO implements Partial<PlayField> {
  @IsOptional()
  @IsBoolean()
  paid?: boolean

  @IsOptional()
  @IsBoolean()
  actived?: boolean

  @IsOptional()
  @IsDate()
  createdAt?: Date

  @IsOptional()
  @IsDate()
  startDate?: Date

  @IsOptional()
  @IsDate()
  endDate?: Date
}
