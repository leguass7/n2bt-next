import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

// import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// import { Badge, Button, IconButton, Toolbar } from '@mui/material'
// import { useRouter } from 'next/router'

import { SimpleModal } from '~/components/Common/SimpleModal'
import { useCustomTableFilter } from '~/components/CustomTable'
import { FormRegister } from '~/components/forms/UnForm/FormRegister'
import { SearchBar } from '~/components/SearchBar'
import { FlexContainer } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { deleteUser } from '~/services/api/user'

import { ModalDelete } from '../ModalDelete'

export interface IUserActions {
  editId?: string
  deleteId?: string
}

export const Actions: React.FC = () => {
  // const { push } = useRouter()
  const [loading, setLoading] = useState(false)
  const { custom, setCustom } = useTableActions<IUserActions>()
  const { emitFetch, setFilter } = useCustomTableFilter()

  // const handleBack = () => push('/admin/users')

  const handleClose = useCallback(() => {
    setCustom({ editId: null, deleteId: null })
  }, [setCustom])

  const handleSuccess = () => {
    emitFetch()
    handleClose()
  }

  const handleSearchText = useCallback(
    (search?: string) => {
      setFilter({ search })
    },
    [setFilter]
  )

  const handleDelete = useCallback(async () => {
    if (custom?.deleteId) {
      setLoading(true)
      const response = await deleteUser(custom?.deleteId)
      if (response?.success) {
        toast.success('Usuário excluído com sucesso')
        emitFetch()
      } else {
        toast.error(response?.message || 'Erro ao excluir usuário')
      }
      handleClose()
      setLoading(false)
    }
  }, [handleClose, emitFetch, custom])

  return (
    <>
      <FlexContainer justify="space-between">
        <div style={{ width: 360, maxWidth: '100%' }}>
          <SearchBar onChangeText={handleSearchText} />
        </div>
        {/* <Toolbar sx={{ justifyContent: 'center' }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </Toolbar> */}
      </FlexContainer>
      <SimpleModal open={!!custom?.editId} onToggle={handleClose} title="Editar usuário">
        <FormRegister userId={custom?.editId} onSuccess={handleSuccess} />
      </SimpleModal>
      <ModalDelete
        open={!!custom?.deleteId}
        title="Excluindo usuário"
        onCancel={handleClose}
        message="Todos os registros vinculados a esse usuário serão removidos."
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  )
}
