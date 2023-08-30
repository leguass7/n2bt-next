import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { Add } from '@mui/icons-material'
import { Button, IconButton, Stack } from '@mui/material'

import { SimpleModal } from '~/components/Common/SimpleModal'
import { useCustomTableFilter } from '~/components/CustomTable'
import { FormRegister } from '~/components/forms/UnForm/FormRegister'
import { SearchBar } from '~/components/SearchBar'
import { type SearchFetchHandler, SearchUserDrawer, type SelectHandler } from '~/components/SearchUserDrawer'
import { FlexContainer, Paragraph, Text } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import type { IUser } from '~/server-side/useCases/user/user.dto'
import { createTranfering } from '~/services/api/transfer'
import { deleteUser, findUser } from '~/services/api/user'

import { FormRegisterAdmin } from '../FormRegisterAdmin'
import { ModalDelete } from '../ModalDelete'

type TranferData = {
  fromId: string
  toId: string
  user?: IUser
}
export interface IUserActions {
  editId?: string
  deleteId?: string
  transferId?: string
}

export const Actions: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { custom, setCustom } = useTableActions<IUserActions>()
  const { emitFetch, setFilter } = useCustomTableFilter()
  const [tranferData, setTransferData] = useState<TranferData>(null)
  const [tranfering, setTransfering] = useState(false)

  const [showAddForm, setShowAddForm] = useState(false)

  const handleClose = useCallback(() => {
    setCustom({ editId: null, deleteId: null, transferId: null })
  }, [setCustom])

  const handleSuccess = useCallback(() => {
    emitFetch()
    handleClose()
  }, [emitFetch, handleClose])

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

  const search: SearchFetchHandler = useCallback(async filter => {
    const response = await findUser(filter)
    return response
  }, [])

  const handleSelect: SelectHandler = useCallback(
    async (toId, user) => {
      setTransferData({ fromId: custom?.transferId, toId, user })
    },
    [custom]
  )

  const toggleAddForm = () => setShowAddForm(old => !old)
  const handleAddFormSuccess = () => {
    toggleAddForm()
    emitFetch()
  }

  const handleConfirm = useCallback(async () => {
    if (tranferData.toId && tranferData.fromId) {
      setTransfering(true)
      const response = await createTranfering(tranferData.fromId, tranferData.toId)
      setTransfering(false)

      if (response?.success) {
        toast.success('Transferencia realizada com sucesso.')
        emitFetch()
      } else toast.error(`${response?.message || 'Erro'}`)
      setTransferData(null)
    }
  }, [tranferData, emitFetch])

  return (
    <>
      <FlexContainer justify="space-between" horizontalPad={20}>
        <div style={{ width: 360, maxWidth: '100%' }}>
          <SearchBar onChangeText={handleSearchText} />
        </div>
        <IconButton onClick={toggleAddForm}>
          <Add />
        </IconButton>
      </FlexContainer>
      <SimpleModal open={showAddForm} onToggle={handleAddFormSuccess} title="Cadastro de usuário">
        <FormRegisterAdmin onSuccess={handleSuccess} />
      </SimpleModal>
      <SimpleModal open={!!custom?.editId} onToggle={handleClose} title="Editar usuário">
        <FormRegister userId={custom?.editId} onSuccess={handleSuccess} />
      </SimpleModal>
      <SimpleModal open={!!tranferData} onToggle={() => setTransferData(null)} title="Transferindo dados">
        <Paragraph align="center">
          <Text bold textSize={18}>
            Para:{' '}
            <Text bold textSize={20}>
              {tranferData?.user?.name}
              <br />
              {tranferData?.user?.email}
            </Text>
          </Text>
          <br />
          <br />
          <Text>
            Essa operação não poderá ser revertida. <Text bold>Deseja continuar?</Text>
          </Text>
          <Stack direction={'row'} justifyContent="center" spacing={1} sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setTransferData(null)} disabled={!!tranfering}>
              CANCELAR
            </Button>
            <Button color="error" variant="contained" onClick={handleConfirm} disabled={!!tranfering}>
              {tranfering ? 'TRANSFERINDO...' : 'SIM, CONTINUE'}
            </Button>
          </Stack>
        </Paragraph>
      </SimpleModal>
      <SearchUserDrawer open={!!custom?.transferId} onClose={handleClose} fetcher={search} onSelect={handleSelect} />
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
