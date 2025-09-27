import { IsString, IsOptional, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePostDto {
  @ApiProperty({ description: 'Текст поста', example: 'Привет! Это мой первый пост.' })
  @IsString()
  text: string

  @ApiProperty({
    description: 'Массив путей к изображениям',
    example: ['uploads/posts/image1.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  images?: string[]
}
