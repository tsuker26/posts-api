import {
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger'

@ApiTags('Профиль пользователя')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя получен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Get()
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.sub)
  }

  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiBody({ type: UpdateUserDto })
  @Patch()
  async updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.sub, dto)
  }

  @ApiOperation({ summary: 'Загрузить аватар пользователя' })
  @ApiResponse({ status: 200, description: 'Аватар успешно загружен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Файл аватара',
        },
      },
    },
  })
  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(null, uniqueSuffix + extname(file.originalname))
        },
      }),
    })
  )
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateAvatar(req.user.sub, file.path)
  }
}
