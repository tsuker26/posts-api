import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Post } from '../post/post.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  login: string

  @Column()
  password: string

  @Column({ nullable: true })
  firstName: string

  @Column({ nullable: true })
  lastName: string

  @Column({ type: 'date', nullable: true })
  birthDate: Date

  @Column({ nullable: true })
  about: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  avatar: string

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]
}
