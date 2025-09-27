import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async updateProfile(userId: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.getProfile(userId)
    Object.assign(user, dto)
    return this.userRepository.save(user)
  }

  async updateAvatar(userId: number, avatarPath: string): Promise<User> {
    const user = await this.getProfile(userId)
    user.avatar = avatarPath
    return this.userRepository.save(user)
  }
}
