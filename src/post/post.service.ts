import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from './post.entity'
import { CreatePostDto, UpdatePostDto } from './dto'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>
  ) {}

  async create(userId: number, dto: CreatePostDto) {
    const post = this.postRepository.create({
      text: dto.text,
      images: dto.images || [],
      author: { id: userId },
    })

    return this.postRepository.save(post)
  }

  async findAll(limit = 10, offset = 0, sort: 'ASC' | 'DESC' = 'DESC'): Promise<Post[]> {
    return this.postRepository.find({
      take: limit,
      skip: offset,
      order: { createdAt: sort },
    })
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } })
    if (!post) throw new NotFoundException('Post not found')
    return post
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id)
    Object.assign(post, dto)
    return this.postRepository.save(post)
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id)
  }

  async findAllByUser(userId: number, limit?: number, offset?: number, sort?: 'ASC' | 'DESC') {
    return this.postRepository.find({
      where: { author: { id: userId } },
      take: limit,
      skip: offset,
      order: { createdAt: sort || 'DESC' },
      relations: ['author'],
    })
  }
}
