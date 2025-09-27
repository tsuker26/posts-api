import { IsOptional, IsString, IsArray } from 'class-validator'

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  text?: string

  @IsOptional()
  @IsArray()
  images?: string[]
}
