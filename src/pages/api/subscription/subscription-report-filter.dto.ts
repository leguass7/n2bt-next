import { IsOptional } from 'class-validator'

export class SubscriptionReportFilterDto {
  @IsOptional()
  paid?: string | boolean

  @IsOptional()
  promoCode?: string

  @IsOptional()
  search?: string

  @IsOptional()
  tournamentId?: number
}
