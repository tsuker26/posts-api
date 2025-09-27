import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm'
import { User } from '../user/user.entity'

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @Column('simple-array', { nullable: true })
  images: string[]

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User
}
