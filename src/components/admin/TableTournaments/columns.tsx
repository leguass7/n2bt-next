import type { IColumnTable } from '~/components/CustomTable'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'

import { ActionMenuCell } from './ActionMenuCell'
import { DateCell, NameCell, SwitchCell } from './Cells'

export const columns: IColumnTable<ITournament>[] = [
  { name: 'title', label: 'Nome', Cell: NameCell },
  { name: 'createdAt', label: 'criado em', Cell: DateCell },
  { name: 'published', label: 'Ativo', align: 'center', width: 90, Cell: SwitchCell },
  { Cell: ActionMenuCell, width: 100, align: 'right' }
  //
]
