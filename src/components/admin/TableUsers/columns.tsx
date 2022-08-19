import type { IColumnTable } from '~/components/CustomTable'
import type { IUser } from '~/server-side/useCases/user/user.dto'

import { ActionCell, DateCell } from './Cells'

export const columns: IColumnTable<IUser>[] = [
  { name: 'name', label: 'Nome' },
  {
    name: 'birday',
    label: 'Niver',
    align: 'center',
    width: 80,
    Cell: DateCell
  },
  { Cell: ActionCell, width: 100, align: 'right' }
  //
]
