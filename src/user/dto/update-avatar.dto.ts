import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateAvatarDto {
  @ApiProperty({ example: 'uploads/avatars/12345.png', description: 'Ссылка на аватар' })
  @IsString()
  avatar: string
}
