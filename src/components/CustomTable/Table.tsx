import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'

import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Table, { type TableProps } from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import styled from 'styled-components'

import CustomTableContext from './CustomTableContext'
import Header from './Header'
import Row from './Row'
import { type GenericObject, type IColumnTable, type Order, type Rows, type TableFetcher } from './types'
import { withCheckedRow } from './withCheckedRow'

const RowList = withCheckedRow(Row)

const NothingText = styled.p`
  text-align: center;
  margin: 0 auto;
  display: block;
  padding: 10px;
`

const CustomTableContainer = styled(TableContainer)`
  margin: 0;
  max-width: 100%;
  width: 100%;

  table tr.selectable {
    cursor: pointer;
  }

  table tr.selected {
    background-color: rgba(0, 0, 0, 0.2);
  }
`

// const TableContainer = styled.div`
//   margin: 0 auto;
//   overflow-x: auto;
//   width: 100%;
//   max-width: 100%;

//   table tr th,
//   table tr th.MuiTableCell-root {
//     font-weight: bold;
//     /* font-weight: bold;
//     color: ${({ theme }) => theme.colors.primary};
//     .Mui-active {
//       color: ${({ theme }) => theme.colors.secondary};
//     } */
//   }

//   table tr .MuiTableCell-root {
//     border-bottom: 1px solid rgba(255, 255, 255, 0.2);
//   }

//   table tr.selected {
//     background-color: rgba(0, 0, 0, 0.2);
//   }

//   table tr.selectable {
//     cursor: pointer;
//   }

//   table th.MuiTableCell-sizeSmall {
//     font-size: 12px;
//   }

//   table th.xsmall,
//   td.xsmall {
//     font-size: 10px;
//   }

//   table th.small,
//   td.small {
//     font-size: 12px;
//   }
// `
const SpanTotal = styled.span`
  font-size: 14px;
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl}px ${theme.spacing.xl}px`};
`

export type SelectRowHandler = (ids?: number[]) => void
export interface CustomTableProps extends TableProps {
  columns?: IColumnTable<GenericObject>[] | any[]
  total?: number
  records?: Rows
  pageSize?: number
  selectPages?: number[]
  onPagination?: TableFetcher
  onRowSelect?: SelectRowHandler
  tableSize?: 'small' | 'medium'
  multiple?: boolean
  defaultSelected?: number[]
  columnNameFixed?: boolean
}

const CustomTable: React.FC<CustomTableProps> = ({
  children,
  tableSize = 'small',
  columns = [],
  records,
  pageSize = 30,
  total = 0,
  onPagination,
  onRowSelect,
  multiple,
  defaultSelected,
  columnNameFixed
}) => {
  const [fixedColumns] = useState(columns)
  const refCount = useRef(0)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState<Order>(['id', 'desc'])
  const [filter, setFilter] = useState<any>({})

  const paginationCount = useMemo(() => {
    return total && total > 0 ? Math.ceil(total / pageSize) : 1
  }, [total, pageSize])

  const emitFetch = useCallback(() => {
    if (onPagination && typeof onPagination === 'function') {
      onPagination({
        fetchId: refCount.current,
        page,
        size: pageSize,
        orderby: order[0],
        order: order[1],
        ...filter
      })
    }
  }, [onPagination, refCount, order, page, filter, pageSize])

  const handlePageChange = useCallback((_e, p) => {
    setPage(p)
  }, [])

  const handleClearFilter = useCallback(() => setFilter({}), [])

  useEffect(() => {
    emitFetch()
    refCount.current += 1
  }, [emitFetch])

  const renderRecords = useCallback(
    (list: any = []) => {
      if (onRowSelect && typeof onRowSelect === 'function') {
        return <RowList list={list} multiple={!!multiple} onChange={onRowSelect} defaultSelected={defaultSelected} />
      }
      return (
        <>
          {list.map((record: any, r: number) => {
            const key = `row-${record?.id || r}`
            return <Row key={key} record={record} />
          })}
        </>
      )
    },
    [onRowSelect, multiple, defaultSelected]
  )

  const pagination = useMemo(() => {
    return { page, size: pageSize, orderby: order[0], order: order[1] }
  }, [order, pageSize, page])

  return (
    <CustomTableContext.Provider
      value={{
        columns: fixedColumns,
        order,
        setOrder,
        filter,
        setFilter,
        clearFilter: handleClearFilter,
        emitFetch,
        pagination,
        records
      }}
    >
      {children}
      <CustomTableContainer>
        <Table stickyHeader={columnNameFixed} size={tableSize}>
          <Header columns={fixedColumns} />
          <TableBody>{records && records.length ? renderRecords(records) : null}</TableBody>
        </Table>
        {records && records.length === 0 && <NothingText>{'Nenum registro encontrado'}</NothingText>}
        {total ? (
          <PaginationContainer>
            <Stack spacing={1}>
              <SpanTotal>
                Total: <b>{total}</b>
              </SpanTotal>
            </Stack>
            <Stack spacing={1}>
              {paginationCount > 1 ? (
                <Pagination count={paginationCount} onChange={handlePageChange} color="primary" variant="outlined" size="large" />
              ) : null}
            </Stack>
          </PaginationContainer>
        ) : null}
      </CustomTableContainer>
    </CustomTableContext.Provider>
  )
}

export default CustomTable
