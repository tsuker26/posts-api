import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.login, dto.password)
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.login, dto.password)
  }

  @Get('getUsers')
  async getUsers() {
    return this.authService.getUsers()
  }
}
