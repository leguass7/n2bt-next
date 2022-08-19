import React, { useCallback, useState } from 'react'

import { CustomTable } from '~/components/CustomTable'
import type { TableFetchParams } from '~/components/CustomTable/types'
import { paginateUsers } from '~/services/api/user'

import { columns } from './columns'
// import { Container } from './styles';
const pageSize = 12

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

  return <CustomTable columns={columns} pageSize={pageSize} total={total} records={records} onPagination={fetchData}></CustomTable>
}
