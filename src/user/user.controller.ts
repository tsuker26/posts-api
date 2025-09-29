import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UpdateAvatarDto } from './dto/update-avatar.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

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

  @ApiOperation({ summary: 'Обновить аватар пользователя (по ссылке)' })
  @ApiResponse({ status: 200, description: 'Аватар успешно обновлен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', example: 'uploads/avatars/12345.png' },
      },
      required: ['avatar'],
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch('avatar')
  async uploadAvatar(@Req() req, @Body() body: UpdateAvatarDto) {
    return this.userService.updateAvatar(req.user.sub, body.avatar)
  }
}
