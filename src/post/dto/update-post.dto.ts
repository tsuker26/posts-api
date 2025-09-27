import { IsOptional, IsString, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePostDto {
  @ApiProperty({
    description: 'Новый текст поста',
    example: 'Обновленный текст поста',
    required: false,
  })
  @IsOptional()
  @IsString()
  text?: string

  @ApiProperty({
    description: 'Новый массив путей к изображениям',
    example: ['uploads/posts/new_image.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  images?: string[]
}
