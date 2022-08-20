import type { IColumnTable } from '~/components/CustomTable'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'

import { ActionCell, DateCell, SwitchCell } from './Cells'

export const columns: IColumnTable<ITournament>[] = [
  { name: 'title', label: 'Nome' },
  { name: 'createdAt', label: 'criado em', Cell: DateCell },
  { name: 'published', label: 'Ativo', align: 'center', width: 90, Cell: SwitchCell },
  { Cell: ActionCell, width: 100, align: 'right' }
  //
]
