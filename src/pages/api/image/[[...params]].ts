import { createHandler, Get, HttpCode, Param } from 'next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import type { ImageFeature } from '~/server-side/useCases/image/image.dto'
import { Image } from '~/server-side/useCases/image/image.entity'

class ImageHandler {
  @Get('/:feature/:featureId')
  @JwtAuthGuard()
  @HttpCode(200)
  async uploadImage(@Param('featureId') featureId: number, @Param('feature') feature: ImageFeature) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(Image)

    const images = (await repo.find({ where: { featureId, feature }, order: { createdAt: 'DESC' } })) ?? []

    return { success: true, images }
  }
}

export default createHandler(ImageHandler)
