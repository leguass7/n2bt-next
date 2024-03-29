import type React from 'react'
import { createContext } from 'react'

import { type GenericObject, type IColumnTable, type Order, type Rows } from './types'

interface Pagination {
  page?: number
  size?: number
  orderby?: string
  order?: string
}
interface IContext {
  columns: IColumnTable<GenericObject>[]
  order: Order
  setOrder: React.Dispatch<React.SetStateAction<Order>>
  filter: any
  setFilter: React.Dispatch<React.SetStateAction<any>>
  clearFilter: () => void
  emitFetch: () => void
  pagination: Pagination
  records: Rows
}

const CustomTableContext = createContext<IContext>({} as IContext)

export default CustomTableContext
