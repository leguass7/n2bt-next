import React, { useCallback, useMemo, useState } from 'react'

import { CircleLoading } from '~/components/CircleLoading'
import { CustomTable } from '~/components/CustomTable'
import type { TableFetchParams } from '~/components/CustomTable/types'
import { FlexContainer, Text } from '~/components/styled'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import type { IRanking } from '~/server-side/useCases/ranking/ranking.dto'
import { paginateRanking } from '~/services/api/ranking'

import { Actions } from './Actions'
import { columns } from './columns'

const pageSize = 64

type Props = {
  tournamentId: number
  categoryId: number
}
export const TableRanking: React.FC<Props> = ({ categoryId, tournamentId }) => {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<IRanking[]>([])
  const [total, setTotal] = useState(0)

  const fetchData = useCallback(
    async (pagination?: TableFetchParams) => {
      setLoading(true)
      const result = await paginateRanking(categoryId, pagination)
      setLoading(false)
      if (result?.success) {
        setRecords(result?.data || [])
        setTotal(result?.total || 0)
      }
    },
    [categoryId]
  )

  const userList = useMemo(() => {
    return records?.map(f => f.userId)
  }, [records])

  return (
    <>
      {categoryId ? (
        <TableActionsProvider>
          <CustomTable columns={columns} pageSize={pageSize} total={total} records={records} onPagination={fetchData} multiple={false}>
            <Actions tournamentId={tournamentId} categoryId={categoryId} userList={userList} />
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
