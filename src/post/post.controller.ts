import {
  Body,
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreatePostDto, UpdatePostDto } from './dto'
import { PostService } from './post.service'

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Посты')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Создать новый пост' })
  @ApiResponse({ status: 201, description: 'Пост успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Текст поста',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Изображения для поста (до 10 файлов)',
        },
      },
      required: ['text'],
    },
  })
  @UseGuards(JwtAuthGuard)
  @HttpPost()
  // @UseInterceptors(
  //   FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
  //     storage: diskStorage({
  //       destination: './uploads/posts',
  //       filename: (_, file, cb) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
  //         cb(null, uniqueSuffix + extname(file.originalname))
  //       },
  //     }),
  //   })
  // )
  @Post()
  async create(@Req() req, @Body() body: { text: string; images?: string[] }) {
    const dto = new CreatePostDto()
    dto.text = body.text
    dto.images = body.images || []
    return this.postService.create(req.user.sub, dto)
  }

  @ApiOperation({ summary: 'Получить все посты' })
  @ApiResponse({ status: 200, description: 'Список постов получен' })
  @ApiQuery({ name: 'limit', required: false, description: 'Количество постов на странице' })
  @ApiQuery({ name: 'offset', required: false, description: 'Смещение для пагинации' })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Сортировка по дате',
  })
  @Get()
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sort') sort?: 'ASC' | 'DESC'
  ) {
    return this.postService.findAll(limit, offset, sort)
  }

  @ApiOperation({ summary: 'Получить мои посты' })
  @ApiResponse({ status: 200, description: 'Список моих постов получен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'limit', required: false, description: 'Количество постов на странице' })
  @ApiQuery({ name: 'offset', required: false, description: 'Смещение для пагинации' })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Сортировка по дате',
  })
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

  @ApiOperation({ summary: 'Получить пост по ID' })
  @ApiResponse({ status: 200, description: 'Пост найден' })
  @ApiResponse({ status: 404, description: 'Пост не найден' })
  @ApiParam({ name: 'id', description: 'ID поста' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postService.findOne(id)
  }

  @ApiOperation({ summary: 'Обновить пост' })
  @ApiResponse({ status: 200, description: 'Пост успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Нет прав на редактирование' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePostDto })
  @ApiParam({ name: 'id', description: 'ID поста' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePostDto) {
    return this.postService.update(id, dto)
  }

  @ApiOperation({ summary: 'Удалить пост' })
  @ApiResponse({ status: 200, description: 'Пост успешно удален' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Нет прав на удаление' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID поста' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.postService.remove(id)
  }
}
