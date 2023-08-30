import React, { useCallback, useState } from 'react'

import { CircleLoading } from '~/components/CircleLoading'
import { CustomTable } from '~/components/CustomTable'
import { type TableFetchParams } from '~/components/CustomTable/types'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import { paginateArenas } from '~/services/api/arena'

import { Actions } from './Actions'
import { columns } from './columns'

const pageSize = 12

export const TableArenas: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(async (pagination?: TableFetchParams) => {
    setLoading(true)
    const result = await paginateArenas(pagination)
    setLoading(false)
    if (result?.success) {
      setRecords(result?.data || [])
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
