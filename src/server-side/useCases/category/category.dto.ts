import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import { type Category } from './category.entity'

export type ICategory = DeepPartial<Category>

export interface IResponseCategory extends IResponseApi {
  category: ICategory
  categoryId: number
}

export interface IResponseCategories extends IResponseApi {
  categories: ICategory[]
}
