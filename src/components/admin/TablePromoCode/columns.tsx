import type { IColumnTable } from '~/components/CustomTable'
import type { IPromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'

import { DateTimeCell, LimitCell, OptionTools } from './Cells'

export const columns: IColumnTable<IPromoCode>[] = [
  { name: 'label', label: 'Rótulo' },
  { name: 'code', label: 'Código' },
  { name: 'usageLimit', label: 'Limite de uso', align: 'center', Cell: LimitCell },
  { name: 'createdAt', label: 'Criado em', Cell: DateTimeCell, width: 130, align: 'right' },
  { Cell: OptionTools, width: 110 }
]
