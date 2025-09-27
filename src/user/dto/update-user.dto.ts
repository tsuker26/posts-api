import { IsEmail, IsOptional, IsString, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({ description: 'Имя пользователя', example: 'Иван', required: false })
  @IsOptional()
  @IsString()
  firstName?: string

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Иванов', required: false })
  @IsOptional()
  @IsString()
  lastName?: string

  @ApiProperty({ description: 'Дата рождения', example: '1990-01-01', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string

  @ApiProperty({ description: 'О себе', example: 'Люблю программирование', required: false })
  @IsOptional()
  @IsString()
  about?: string

  @ApiProperty({ description: 'Email адрес', example: 'user@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ description: 'Номер телефона', example: '+7 (999) 123-45-67', required: false })
  @IsOptional()
  @IsString()
  phone?: string
}
