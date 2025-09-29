import { Controller, Delete, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { promises as fs } from 'fs'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Загрузить изображения в указанную папку' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['files'],
    },
  })
  @ApiParam({ name: 'folder', description: 'Название папки для загрузки' })
  @ApiResponse({ status: 201, description: 'Изображения загружены' })
  @Post(':folder')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, _, cb) => {
          const folder = req.params.folder || 'default'
          const uploadPath = join(process.cwd(), `uploads/${folder}`)

          fs.mkdir(uploadPath, { recursive: true })
            .then(() => cb(null, uploadPath))
            .catch((err) => cb(err, uploadPath))
        },
        filename: (_, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(null, uniqueSuffix + extname(file.originalname))
        },
      }),
    })
  )
  uploadImages(@UploadedFiles() files: Express.Multer.File[], @Param('folder') folder: string) {
    return this.uploadService.saveImages(files, folder)
  }

  @Delete(':folder/:filename')
  async deleteFile(@Param('folder') folder: string, @Param('filename') filename: string) {
    return this.uploadService.deleteImage(folder, filename)
  }
}
