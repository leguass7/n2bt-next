import type { IColumnTable } from '~/components/CustomTable'
import type { ICategory } from '~/server-side/useCases/category/category.dto'

import { ActionCell, DateTimeCell, NameCell, SwitchCell } from './Cells'

export const columns: IColumnTable<ICategory>[] = [
  { name: 'title', label: 'Nome', Cell: NameCell },
  { name: 'price', label: 'Preço' },
  { name: 'createdAt', label: 'criado em', Cell: DateTimeCell },
  { name: 'published', label: 'Ativo', align: 'center', width: 80, Cell: SwitchCell },
  { Cell: ActionCell, width: 80, align: 'right' }
  //
]
