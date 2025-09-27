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

  async register(login: string, password: string, name?: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({ login, password: hashedPassword, name })
    await this.userRepository.save(user)
    return { message: 'User registered successfully' }
  }

  async login(login: string, password: string) {
    const user = await this.userRepository.findOne({ where: { login } })
    console.log('Найден пользователь:', user)

    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Пароль совпадает:', isPasswordValid)

    if (!isPasswordValid) return null

    const payload = { sub: user.id, login: user.login }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async getUsers() {
    return this.userRepository.find()
  }
}
