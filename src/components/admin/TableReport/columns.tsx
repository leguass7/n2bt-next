import { type IColumnTable } from '~/components/CustomTable'
import { type ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import {
  ReportGenderCell,
  ReportNameCell,
  ReportPaymentCell,
  ReportPriceCell,
  ReportPromoCodeCell,
  ReportShirtSizeCell,
  ReportStatusCell
} from './Cells'

export const reportColumns: IColumnTable<ISubscription>[] = [
  // { name: 'id', label: 'ID', align: 'center', width: 50 },
  { label: 'Nome', Cell: ReportNameCell },
  { name: 'paid', label: 'Pago', align: 'center', Cell: ReportPaymentCell },
  { label: 'Valor', Cell: ReportPriceCell },
  { label: 'Código promocional', Cell: ReportPromoCodeCell },
  { label: 'Tamanho', align: 'center', Cell: ReportShirtSizeCell },
  { label: 'Sexo', align: 'center', Cell: ReportGenderCell },
  { label: 'Entregue', align: 'center', Cell: ReportStatusCell }
  // { Cell: ActionCell, width: 80, align: 'right' }
  //
]
