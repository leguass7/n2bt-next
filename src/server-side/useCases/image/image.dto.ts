import type { IResponseApi } from '~/server-side/api.interface'

import { Image } from './image.entity'

export interface IImageMetadata {
  anyData: any
}

export type ImageFeature = Image['feature']

export interface IResponseGetImages extends IResponseApi {
  images: Image[]
}

export interface IResponseGetImage extends IResponseApi {
  image: Image
}
