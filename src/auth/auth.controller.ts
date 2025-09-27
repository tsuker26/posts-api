import { Body, Controller, Post, Res, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import type { Response, Request } from 'express'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const SEVEN_DAYS_MS = 7 * ONE_DAY_MS

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.login, dto.password)
  }

  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    schema: { properties: { access_token: { type: 'string' } } },
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto.login, dto.password)
    if (!tokens) return { message: 'Invalid credentials' }

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: SEVEN_DAYS_MS,
    })

    return { access_token: tokens.accessToken }
  }

  @ApiOperation({ summary: 'Обновление токена доступа' })
  @ApiResponse({
    status: 200,
    description: 'Токен успешно обновлен',
    schema: { properties: { access_token: { type: 'string' } } },
  })
  @ApiResponse({ status: 401, description: 'Неверный refresh token' })
  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh = req.cookies['refresh_token']
    if (!refresh) return { message: 'No refresh token' }

    const tokens = this.authService.refreshToken(refresh)
    if (!tokens) return { message: 'Invalid refresh token' }

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: SEVEN_DAYS_MS,
    })

    return { access_token: tokens.accessToken }
  }
}
