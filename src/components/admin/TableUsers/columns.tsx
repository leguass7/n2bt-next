import type { IColumnTable } from '~/components/CustomTable'
import type { IUser } from '~/server-side/useCases/user/user.dto'

import { ActionMenuCell } from './ActionMenuCell'
import { CountCell, DateCell, NameCell, PhoneCell, LastAcessCell } from './Cells'

export const columns: IColumnTable<IUser & { totalSubscriptions?: number; totalPayments?: number }>[] = [
  { name: 'name', label: 'Nome', Cell: NameCell },
  { name: 'phone', label: 'Telefone', Cell: PhoneCell },
  { label: 'Inscrições', Cell: CountCell },
  {
    name: 'birday',
    label: 'Niver',
    align: 'center',
    width: 80,
    Cell: DateCell
  },
  { name: 'lastAcess', label: 'Acesso', Cell: LastAcessCell, align: 'center' },
  { Cell: ActionMenuCell, width: 100, align: 'right' }
  //
]
