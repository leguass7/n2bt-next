import type { IColumnTable } from '~/components/CustomTable'
import type { IArena } from '~/server-side/useCases/arena/arena.dto'

import { ActionCell, DateCell, SwitchCell } from './Cells'

export const columns: IColumnTable<IArena>[] = [
  { name: 'title', label: 'Nome' },
  { name: 'createdAt', label: 'criado em', Cell: DateCell },
  { name: 'published', label: 'Ativo', align: 'center', width: 90, Cell: SwitchCell },
  { Cell: ActionCell, width: 100, align: 'right' }
  //
]
