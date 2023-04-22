import type { IColumnTable } from '~/components/CustomTable'
import type { IPromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'

import { DateTimeCell, LimitCell, OptionTools, SwitchCell } from './Cells'

export const columns: IColumnTable<IPromoCode>[] = [
  { name: 'label', label: 'Rótulo' },
  { name: 'code', label: 'Código' },
  { name: 'usageLimit', label: 'Limite de uso', align: 'center', Cell: LimitCell },
  { name: 'createdAt', label: 'Criado em', Cell: DateTimeCell, width: 130, align: 'right' },
  { name: 'actived', label: 'Ativo', Cell: SwitchCell, width: 80, align: 'center' },
  { Cell: OptionTools, width: 220 }
]
