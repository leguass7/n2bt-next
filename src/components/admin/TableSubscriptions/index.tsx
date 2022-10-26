import React, { useCallback, useState } from 'react'

import { CircleLoading } from '~/components/CircleLoading'
import { CustomTable } from '~/components/CustomTable'
import type { TableFetchParams } from '~/components/CustomTable/types'
import { FlexContainer, Text } from '~/components/styled'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { paginateSubscription } from '~/services/api/subscriptions'

import { Actions } from './Actions'
import { columns } from './columns'

const pageSize = 1000

export type FetchHandler = (data: ISubscription[]) => any
type Props = {
  tournamentId: number
  categoryId: number
  onFetchData?: FetchHandler
}

export const TableSubscriptions: React.FC<Props> = ({ categoryId, tournamentId, onFetchData }) => {
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
      if (onFetchData) onFetchData(result?.data || [])
    },
    [categoryId, onFetchData]
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
