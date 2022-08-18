import React, { useCallback, useContext, useMemo } from 'react'

import CustomTableContext from './CustomTableContext'

export default function useCustomTable() {
  const context = useContext(CustomTableContext)
  return context
}

type FindRecord = <T>(key: string, value: any) => T
export function useCustomTableRecords() {
  const { records = [] } = useContext(CustomTableContext)

  const findRecord = useCallback(
    (key: string, value: any) => {
      const found = records?.find(f => key in f && f[key] === value)
      return found as Record<string, any>
    },
    [records]
  )

  return { findRecord: findRecord as FindRecord, records }
}

export function useCustomTableFilter<T extends Record<string, any>>() {
  const { setFilter, clearFilter, emitFetch, filter: localFilter, pagination } = useContext(CustomTableContext)
  // const configFilter: React.Dispatch<React.SetStateAction<T>> = useCallback(filter => setFilter(filter), [setFilter])

  const configFilter: React.Dispatch<React.SetStateAction<T>> = useCallback(setFilter, [setFilter])

  const updateFilter: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (data: T) => {
      setFilter(old => ({ ...old, ...data }))
    },
    [setFilter]
  )

  const hasFilter = useMemo(() => {
    const keys = Object.values(localFilter)?.filter(f => !!f)?.length
    return !!keys
  }, [localFilter])

  return { setFilter: configFilter, clearFilter, emitFetch, filter: localFilter as T, hasFilter, updateFilter, pagination }
}
