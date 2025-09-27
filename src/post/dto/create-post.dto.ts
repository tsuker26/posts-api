import { IsString, IsOptional, IsArray } from 'class-validator'

export class CreatePostDto {
  @IsString()
  text: string

  @IsOptional()
  @IsArray()
  images?: string[]
}
