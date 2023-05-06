import { IsOptional } from 'class-validator'

export class SearchPaymentDto {
  @IsOptional()
  promoCodeId?: number

  @IsOptional()
  tournamentId?: number
}
