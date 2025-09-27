import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { Post } from './post.entity'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    PassportModule,
    JwtModule.register({ secret: process.env.JWT_SECRET || 'secretKey' }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
