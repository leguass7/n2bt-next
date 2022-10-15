import { CustomTable } from '~/components/CustomTable'
// import type { TableFetchParams } from '~/components/CustomTable/types'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { ReportActions } from './Actions'
import { reportColumns } from './columns'

interface Props {
  data: ISubscription[]
  fetchData: () => void
}

export const TableReport: React.FC<Props> = ({ data, fetchData }) => {
  return (
    <TableActionsProvider>
      <CustomTable title="Participantes" columns={reportColumns} pageSize={data.length} total={data.length} records={data} onPagination={fetchData}>
        <ReportActions />
      </CustomTable>
    </TableActionsProvider>
  )
}
