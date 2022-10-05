import type { IColumnTable } from '~/components/CustomTable'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'

import { ActionMenuCell } from './ActionMenuCell'
import { DateCell, DateTimeCell, NameCell, SwitchCell } from './Cells'

export const columns: IColumnTable<ITournament>[] = [
  { name: 'title', label: 'Nome', Cell: NameCell },

  { name: 'expires', label: 'Inicio', Cell: ({ record }) => <DateCell date={record?.expires} /> },
  { name: 'subscriptionEnd', label: 'Inscrições até', Cell: ({ record }) => <DateCell date={record?.subscriptionEnd} /> },
  { name: 'createdAt', label: 'criado em', Cell: DateTimeCell },
  { name: 'published', label: 'Ativo', align: 'center', width: 90, Cell: SwitchCell },
  { Cell: ActionMenuCell, width: 100, align: 'right' }
  //
]
