import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ description: 'Логин пользователя', example: 'user123' })
  @IsNotEmpty()
  @IsString()
  login: string

  @ApiProperty({ description: 'Пароль пользователя', example: 'password123', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string
}
