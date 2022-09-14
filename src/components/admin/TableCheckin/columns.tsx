import type { IColumnTable } from '~/components/CustomTable'
import type { CheckinRawDto } from '~/server-side/useCases/checkin/checkin.dto'

import { NameCell, CheckCell, DateTimeCell } from './Cells'

export const columns: IColumnTable<CheckinRawDto>[] = [
  { align: 'center', Cell: CheckCell, width: 26 },
  { name: 'name', label: 'Atleta', Cell: NameCell },
  { name: 'createdAt', label: 'Data', Cell: DateTimeCell }
]
