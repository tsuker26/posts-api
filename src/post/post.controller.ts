import {
  Controller,
  Get,
  Post as HttpPost,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { PostService } from './post.service'
import { CreatePostDto, UpdatePostDto } from './dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      storage: diskStorage({
        destination: './uploads/posts',
        filename: (_, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(null, uniqueSuffix + extname(file.originalname))
        },
      }),
    })
  )
  async create(
    @Req() req,
    @Body() body: any,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    const dto = new CreatePostDto()
    dto.text = body.text
    dto.images = files?.images?.map((file) => file.path) || []

    return this.postService.create(req.user.sub, dto)
  }

  @Get()
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'ASC' | 'DESC'
  ) {
    return this.postService.findAll(limit, offset, sort)
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMyPosts(
    @Req() req,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'ASC' | 'DESC'
  ) {
    return this.postService.findAllByUser(req.user.sub, limit, offset, sort)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePostDto) {
    return this.postService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.postService.remove(id)
  }
}
