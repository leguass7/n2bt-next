import type { IColumnTable } from '~/components/CustomTable'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { NameCell, PriceCell, PaidCell, DateTimeCell, CheckCell, SwitchCell } from './Cells'

export const columns: IColumnTable<ISubscription>[] = [
  { align: 'center', Cell: CheckCell, width: 26 },
  { name: 'id', label: 'ID', align: 'center', width: 50 },
  { name: 'user', label: 'Atleta', Cell: NameCell },
  { name: 'verified', label: 'OK', Cell: SwitchCell, align: 'center', width: 78 },
  { name: 'value', label: 'Valor', Cell: PriceCell, width: 50, align: 'right' },
  { name: 'paid', label: 'PG', Cell: PaidCell, align: 'center' },
  { name: 'createdAt', label: 'Data', Cell: DateTimeCell, align: 'right' }

  // { Cell: ActionCell, width: 80, align: 'right' }
  //
]
