import type { IColumnTable } from '~/components/CustomTable'
import type { IPromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'

import { DateTimeCell, OptionTools } from './Cells'

export const columns: IColumnTable<IPromoCode>[] = [
  { name: 'label', label: 'Rótulo' },
  { name: 'code', label: 'Código' },
  { name: 'createdAt', label: 'Data', Cell: DateTimeCell, width: 110 },
  { Cell: OptionTools, width: 110 }
]
