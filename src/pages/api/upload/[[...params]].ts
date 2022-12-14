import multer from 'multer'
import { createHandler, HttpCode, Post, Req, UploadedFile, UseMiddleware } from 'next-api-decorators'

import type { RequestMulterFile } from '~/server-side/api.interface'
import { prepareConnection } from '~/server-side/database/conn'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { Image } from '~/server-side/useCases/image/image.entity'

const uploadMiddle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 500 }
}).single('file')

class UploadHandler {
  @Post('/tournament/:tournamentId')
  @JwtAuthGuard()
  @UseMiddleware(uploadMiddle)
  @HttpCode(200)
  async uploadImage(@Req() req: Omit<AuthorizedApiRequest, 'body'>, @UploadedFile() file: RequestMulterFile) {
    const { auth, query } = req
    const tournamentId = +query?.params?.[1] || 0

    // manipular arquivo aqui
    // console.log('files', tournamentId, auth, file)

    const url = file?.buffer ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}` : null

    const ds = await prepareConnection()
    const repo = ds.getRepository(Image)
    const saveData = repo.create({
      actived: true,
      createdBy: auth?.userId,
      feature: 'tournament',
      featureId: tournamentId,
      size: file?.size || 0,
      label: file?.originalname,
      mimetype: file?.mimetype,
      url,
      metaData: { anyData: 'teste' }
    })

    await repo.save(saveData)

    return { success: true }
  }
}

export default createHandler(UploadHandler)

// important
export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
}
