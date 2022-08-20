import React, { useCallback, useState } from 'react'

import { useAdminArena } from '~/components/app/LayoutAdmin/LayoutAdminProvider'
import { CircleLoading } from '~/components/CircleLoading'
import { CustomTable } from '~/components/CustomTable'
import { TableFetchParams } from '~/components/CustomTable/types'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import { paginateTournaments } from '~/services/api/tournament'

import { Actions } from './Actions'
import { columns } from './columns'

const pageSize = 12

export const TableTournaments: React.FC = () => {
  const [arenaId] = useAdminArena()
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(
    async (pagination?: TableFetchParams) => {
      setLoading(true)
      const result = await paginateTournaments(arenaId, pagination)
      setLoading(false)
      if (result?.success) {
        setRecords(result?.data || [])
        setTotal(result?.total || 0)
      }
    },
    [arenaId]
  )

  return (
    <TableActionsProvider>
      <CustomTable columns={columns} pageSize={pageSize} total={total} records={records} onPagination={fetchData}>
        <Actions />
      </CustomTable>
      {loading && <CircleLoading />}
    </TableActionsProvider>
  )
}
