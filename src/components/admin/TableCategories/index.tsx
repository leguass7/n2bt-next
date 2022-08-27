import React, { useCallback, useState } from 'react'

import { useAdminTournament } from '~/components/app/LayoutAdmin/LayoutAdminProvider'
import { CircleLoading } from '~/components/CircleLoading'
import { CustomTable } from '~/components/CustomTable'
import type { TableFetchParams } from '~/components/CustomTable/types'
import { FlexContainer, Text } from '~/components/styled'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import { paginateCategories } from '~/services/api/category'

import { Actions } from './Actions'
import { columns } from './columns'

// import { Container } from './styles';
const pageSize = 12
export const TableCategories: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const [total, setTotal] = useState(0)
  const [tournamentId] = useAdminTournament()

  const fetchData = useCallback(
    async (pagination?: TableFetchParams) => {
      setLoading(true)
      const result = await paginateCategories(tournamentId, pagination)
      setLoading(false)
      if (result?.success) {
        setRecords(result?.data || [])
        setTotal(result?.total || 0)
      }
    },
    [tournamentId]
  )

  return (
    <>
      {tournamentId ? (
        <TableActionsProvider>
          <CustomTable columns={columns} pageSize={pageSize} total={total} records={records} onPagination={fetchData} multiple={false}>
            <Actions />
          </CustomTable>
          {loading && <CircleLoading />}
        </TableActionsProvider>
      ) : (
        <FlexContainer justify="center">
          <Text>Selecione um torneio</Text>
        </FlexContainer>
      )}
    </>
  )
}
