import React, { useCallback, useState } from 'react'

import { CircleLoading } from '~/components/CircleLoading'
import { CustomTable } from '~/components/CustomTable'
import type { TableFetchParams } from '~/components/CustomTable/types'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import { paginateUsers } from '~/services/api/user'

import { Actions } from './Actions'
import { columns } from './columns'

const pageSize = 24

export const TableUsers: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(async (pagination?: TableFetchParams) => {
    setLoading(true)
    const result = await paginateUsers(pagination)
    setLoading(false)
    if (result?.success) {
      setRecords(result.data)
      setTotal(result?.total || 0)
    }
  }, [])

  return (
    <TableActionsProvider>
      <CustomTable columns={columns} pageSize={pageSize} total={total} records={records} onPagination={fetchData}>
        <Actions />
      </CustomTable>
      {loading && <CircleLoading />}
    </TableActionsProvider>
  )
}
