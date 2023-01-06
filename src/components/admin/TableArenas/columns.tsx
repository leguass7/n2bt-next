import type { IColumnTable } from '~/components/CustomTable'
import type { IArena } from '~/server-side/useCases/arena/arena.dto'

import { ActionCell, ArenaNameCell, DateCell, SwitchCell } from './Cells'

export const columns: IColumnTable<IArena>[] = [
  { label: 'Nome', Cell: ArenaNameCell },
  { name: 'createdAt', label: 'criado em', Cell: DateCell },
  { name: 'published', label: 'Ativo', align: 'center', width: 90, Cell: SwitchCell },
  { Cell: ActionCell, width: 100, align: 'right' }
  //
]
