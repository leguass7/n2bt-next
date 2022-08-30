import type { IColumnTable } from '~/components/CustomTable'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { NameCell, PriceCell, PaidCell, DateTimeCell } from './Cells'

export const columns: IColumnTable<ISubscription>[] = [
  { name: 'id', label: 'ID', align: 'center', width: 50 },
  { name: 'user', label: 'Atleta', Cell: NameCell },
  { name: 'value', label: 'Valor', Cell: PriceCell, width: 50 },
  { name: 'paid', label: 'PG', Cell: PaidCell },
  { name: 'createdAt', label: 'Data', Cell: DateTimeCell, align: 'right' }

  // { Cell: ActionCell, width: 80, align: 'right' }
  //
]
