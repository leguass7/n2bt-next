import type { IColumnTable } from '~/components/CustomTable'
import type { IRanking } from '~/server-side/useCases/ranking/ranking.dto'

import { NameCell, DateTimeCell, CheckCell, ActionCell } from './Cells'

export const columns: IColumnTable<IRanking>[] = [
  { align: 'center', Cell: CheckCell, width: 26 },
  { name: 'user', label: 'Atleta', Cell: NameCell },
  { name: 'points', label: 'Pontos' },
  { name: 'createdAt', label: 'Data', Cell: DateTimeCell, align: 'right' },
  { Cell: ActionCell, width: 80, align: 'right' }
]
