import { IsOptional } from 'class-validator'

export class SearchPromoCodeDto {
  @IsOptional()
  code?: string

  @IsOptional()
  label?: string

  @IsOptional()
  OR?: boolean
}
