import { IColumnTable } from '~/components/CustomTable'
import { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { ReportGenderCell, ReportNameCell, ReportPaymentCell, ReportShirtSizeCell, ReportStatusCell } from './Cells'

export const reportColumns: IColumnTable<ISubscription>[] = [
  // { name: 'id', label: 'ID', align: 'center', width: 50 },
  { label: 'Nome', Cell: ReportNameCell },
  { name: 'paid', label: 'Pago', align: 'center', Cell: ReportPaymentCell },
  { label: 'Camisetas', align: 'center', Cell: ReportShirtSizeCell },
  { label: 'Sexo', align: 'center', Cell: ReportGenderCell },
  { label: 'Status', align: 'center', Cell: ReportStatusCell }
  // { Cell: ActionCell, width: 80, align: 'right' }
  //
]
