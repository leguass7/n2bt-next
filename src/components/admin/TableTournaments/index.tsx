import React, { useCallback, useState } from 'react'

import { useAdminArena, useAdminTournament } from '~/components/app/LayoutAdmin/LayoutAdminProvider'
import { CircleLoading } from '~/components/CircleLoading'
import { CustomTable } from '~/components/CustomTable'
import type { SelectRowHandler } from '~/components/CustomTable/Table'
import type { TableFetchParams } from '~/components/CustomTable/types'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import { paginateTournaments } from '~/services/api/tournament'

import { Actions } from './Actions'
import { columns } from './columns'

const pageSize = 12
type Props = {
  onRowSelect?: SelectRowHandler
}
export const TableTournaments: React.FC<Props> = ({ onRowSelect }) => {
  const [arenaId] = useAdminArena()
  const [, setTournamentId] = useAdminTournament()
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

  const handleRowSelect: SelectRowHandler = ids => {
    setTournamentId(ids[0] || 0)
    if (onRowSelect) onRowSelect(ids)
  }

  return (
    <TableActionsProvider>
      <CustomTable
        columns={columns}
        pageSize={pageSize}
        total={total}
        records={records}
        onPagination={fetchData}
        onRowSelect={handleRowSelect}
        multiple={false}
      >
        <Actions />
      </CustomTable>
      {loading && <CircleLoading />}
    </TableActionsProvider>
  )
}
