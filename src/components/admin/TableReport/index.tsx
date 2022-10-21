import { CustomTable } from '~/components/CustomTable'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { ReportActions } from './Actions'
import { reportColumns } from './columns'

interface Props {
  data: ISubscription[]
  fetchData: () => void
}

export const TableReport: React.FC<Props> = ({ data, fetchData }) => {
  return (
    <TableActionsProvider>
      <CustomTable title="Participantes" columns={reportColumns} pageSize={20} total={data.length} records={data} onPagination={fetchData}>
        <ReportActions />
      </CustomTable>
    </TableActionsProvider>
  )
}
