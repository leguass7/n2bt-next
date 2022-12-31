import multer from 'multer'
import { createHandler, HttpCode, Post, Req, UploadedFile, UseMiddleware } from 'next-api-decorators'

import type { RequestMulterFile } from '~/server-side/api.interface'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 500 }
}).single('file')

class UploadHandler {
  @Post('/tournament/:tournamentId')
  @JwtAuthGuard()
  @UseMiddleware(upload)
  @HttpCode(200)
  async uploadImage(@Req() req: Omit<AuthorizedApiRequest, 'body'>, @UploadedFile() file: RequestMulterFile) {
    const { auth, query } = req
    const tournamentId = +query?.params?.[1] || 0

    // manipular arquivo aqui
    console.log('files', tournamentId, auth, file)

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
