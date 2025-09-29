import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { User } from './user/user.entity'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    origin: true,
    credentials: true,
  })

  const dataSource = app.get(DataSource)
  const userRepository = dataSource.getRepository(User)

  const existingUser = await userRepository.findOne({ where: { login: 'admin' } })

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const user = userRepository.create({
      login: 'admin',
      password: hashedPassword,
    })
    await userRepository.save(user)
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  app.use(cookieParser())

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  })

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('Документация API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
