import { IsDate, IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

import { UserGender } from '~/server-side/useCases/user/user.dto'

export class CreateUserDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string

  @IsNotEmpty()
  password: string

  @IsOptional()
  @IsDate({ message: 'Data inválida' })
  birday: Date

  @IsOptional()
  phone: string

  @IsOptional()
  cpf: string

  @IsOptional()
  shirtSize: string

  @IsOptional()
  gender: UserGender
}
