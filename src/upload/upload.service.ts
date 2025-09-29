import { Injectable } from '@nestjs/common'
import { join } from 'path'
import { promises as fs } from 'fs'

@Injectable()
export class UploadService {
  saveImages(files: Express.Multer.File[], folder: string) {
    return files.map((file) => ({
      url: `uploads/${folder}/${file.filename}`,
      filename: file.filename,
      folder,
    }))
  }

  async deleteImage(folder: string, filename: string) {
    const filePath = join(process.cwd(), `uploads/${folder}`, filename)

    try {
      await fs.access(filePath)
      await fs.unlink(filePath)
      return { message: 'Изображение удалено', filename, folder }
    } catch (error) {
      console.log(error)
      return { message: 'Файл не найден', filename, folder }
    }
  }
}
