import React, { useCallback, useState } from 'react'

import { CircleLoading } from '~/components/CircleLoading'
import { CustomTable } from '~/components/CustomTable'
import type { TableFetchParams } from '~/components/CustomTable/types'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import type { CheckinRawDto } from '~/server-side/useCases/checkin/checkin.dto'
import { listCheckin } from '~/services/api/checkin'

import { Actions } from './Actions'
import { columns } from './columns'

const pageSize = 1000

type Props = {
  tournamentId: number
}
export const TableCheckin: React.FC<Props> = ({ tournamentId }) => {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<CheckinRawDto[]>([])
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(
    async (pagination?: TableFetchParams) => {
      if (tournamentId) {
        setLoading(true)
        const result = await listCheckin(tournamentId, pagination)
        setLoading(false)
        if (result?.success) {
          setRecords(result?.data || [])
          setTotal(result?.total || 0)
        }
      }
    },
    [tournamentId]
  )

  return (
    <>
      <TableActionsProvider>
        <CustomTable columns={columns} pageSize={pageSize} total={total} records={records} onPagination={fetchData} multiple={false}>
          <Actions tournamentId={tournamentId} />
        </CustomTable>
        {loading && <CircleLoading />}
      </TableActionsProvider>
    </>
  )
}
