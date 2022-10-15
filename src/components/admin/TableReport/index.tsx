import { Typography } from '@mui/material'

import { CustomTable } from '~/components/CustomTable'
// import type { TableFetchParams } from '~/components/CustomTable/types'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { reportColumns } from './columns'

interface Props {
  data: ISubscription[]
  fetchData: () => void
}

export const TableReport: React.FC<Props> = ({ data, fetchData }) => {
  return (
    <TableActionsProvider>
      <CustomTable columns={reportColumns} pageSize={data.length} total={data.length} records={data} onPagination={fetchData}>
        {/* <Actions /> */}
        <Typography variant="h6">Participantes</Typography>
      </CustomTable>
    </TableActionsProvider>
  )
}
