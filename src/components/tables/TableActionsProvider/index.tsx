import React, { createContext, useContext, useState, useCallback } from 'react'

// export { MessageDelete } from './MessageDelete'

export interface IDeleteContainer {
  title?: string
  message?: string
  type?: string
  onConfirm?: () => Promise<void>
}

export type SelectedId = number | string

export type DeleteHandler<T = any> = (id?: SelectedId) => Promise<T | void>
export type SelectHandler = (id: SelectedId, checked?: boolean) => void

export interface ITableActionsContext {
  deleting?: boolean
  showDelete?: IDeleteContainer | null
  setShowDelete: React.Dispatch<React.SetStateAction<IDeleteContainer>>
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>
  deleteHandler?: DeleteHandler
  selecthandler?: SelectHandler
  selectedIds?: SelectedId[]
  setSelectedIds?: React.Dispatch<React.SetStateAction<SelectedId[]>>
  isSelectMode?: boolean
  setIsSelectMode?: React.Dispatch<React.SetStateAction<boolean>>
  custom?: any
  setCustom?: React.Dispatch<React.SetStateAction<any>>
}
export const TableActionsContext = createContext({} as ITableActionsContext)

type Props = {
  children?: React.ReactNode
  deleteHandler?: DeleteHandler
  selecthandler?: SelectHandler
}
export const TableActionsProvider: React.FC<Props> = ({ children, deleteHandler, selecthandler }) => {
  const [showDelete, setShowDelete] = useState<IDeleteContainer>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<SelectedId[]>([])
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [custom, setCustom] = useState(null)

  return (
    <TableActionsContext.Provider
      value={{
        showDelete,
        setShowDelete,
        setDeleting,
        deleting,
        deleteHandler,
        selecthandler,
        setSelectedIds,
        selectedIds,
        isSelectMode,
        setIsSelectMode,
        setCustom,
        custom
      }}
    >
      {children}
    </TableActionsContext.Provider>
  )
}

export function useTableActions<T = any>() {
  const {
    showDelete,
    setShowDelete,
    setDeleting,
    deleting,
    deleteHandler,
    selecthandler,
    setSelectedIds,
    selectedIds,
    isSelectMode,
    setIsSelectMode,
    setCustom,
    custom
  } = useContext(TableActionsContext)

  const hideDeleteMessage = useCallback(() => {
    setShowDelete(null)
  }, [setShowDelete])

  const sendDelete = useCallback(
    async (personId: number) => {
      if (deleteHandler) {
        setDeleting(true)
        const response = deleteHandler && (await deleteHandler(personId))
        setDeleting(false)
        return response
      }
      return null
    },
    [setDeleting, deleteHandler]
  )

  const clearSelected = useCallback(() => {
    setSelectedIds([])
  }, [setSelectedIds])

  const toggleSelected = useCallback(
    (id: number | string) => {
      setSelectedIds(old => {
        const has = old.includes(id)
        if (selecthandler) selecthandler(id, !has)
        return has ? old.filter(f => f !== id) : [...old, id].sort()
      })
    },
    [setSelectedIds, selecthandler]
  )

  return {
    showDelete,
    hideDeleteMessage,
    setShowDelete,
    sendDelete,
    deleting,
    deleteHandler,
    selecthandler,
    //
    toggleSelected,
    isSelectMode,
    selectedIds,
    setIsSelectMode,
    clearSelected,
    // select

    custom: custom as T,
    setCustom: setCustom as React.Dispatch<React.SetStateAction<T>>
  }
}
