import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  login: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  name?: string
}
