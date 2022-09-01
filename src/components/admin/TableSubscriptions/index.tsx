import React, { useCallback, useState } from 'react'

import { CircleLoading } from '~/components/CircleLoading'
import { CustomTable } from '~/components/CustomTable'
import type { TableFetchParams } from '~/components/CustomTable/types'
import { FlexContainer, Text } from '~/components/styled'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import { paginateSubscription } from '~/services/api/subscriptions'

import { Actions } from './Actions'
import { columns } from './columns'

const pageSize = 32
type Props = {
  tournamentId: number
  categoryId: number
}

export const TableSubscriptions: React.FC<Props> = ({ categoryId, tournamentId }) => {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(
    async (pagination?: TableFetchParams) => {
      setLoading(true)
      const result = await paginateSubscription(categoryId, pagination)
      setLoading(false)
      if (result?.success) {
        setRecords(result?.data || [])
        setTotal(result?.total || 0)
      }
    },
    [categoryId]
  )

  return (
    <>
      {categoryId ? (
        <TableActionsProvider>
          <CustomTable columns={columns} pageSize={pageSize} total={total} records={records} onPagination={fetchData} multiple={false}>
            <Actions tournamentId={tournamentId} />
          </CustomTable>
          {loading && <CircleLoading />}
        </TableActionsProvider>
      ) : (
        <FlexContainer justify="center">
          <Text>Selecione uma categoria {categoryId}</Text>
        </FlexContainer>
      )}
    </>
  )
}
