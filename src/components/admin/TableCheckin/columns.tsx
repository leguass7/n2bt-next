import type { IColumnTable } from '~/components/CustomTable'
import type { CheckinRawDto } from '~/server-side/useCases/checkin/checkin.dto'

import { NameCell, DateTimeCell, SwitchCell } from './Cells'

export const columns: IColumnTable<CheckinRawDto>[] = [
  { name: 'name', label: 'Atleta', Cell: NameCell },
  { name: 'check', label: 'Checkin', Cell: SwitchCell, width: 80 },
  { name: 'createdAt', label: 'Data', Cell: DateTimeCell, width: 110 }
]
