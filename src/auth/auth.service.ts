import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(login: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({ login, password: hashedPassword })
    await this.userRepository.save(user)
    return { message: 'User registered successfully' }
  }

  async login(login: string, password: string) {
    const user = await this.userRepository.findOne({ where: { login } })
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return null

    const payload = { sub: user.id, login: user.login }

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

    return { accessToken, refreshToken }
  }

  refreshToken(refresh: string) {
    try {
      const payload = this.jwtService.verify(refresh)
      const newAccess = this.jwtService.sign(
        { sub: payload.sub, login: payload.login },
        { expiresIn: '15m' }
      )
      const newRefresh = this.jwtService.sign(
        { sub: payload.sub, login: payload.login },
        { expiresIn: '7d' }
      )

      return { accessToken: newAccess, refreshToken: newRefresh }
    } catch {
      return null
    }
  }
}
