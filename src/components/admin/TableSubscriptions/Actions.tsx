import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

// import AddIcon from '@mui/icons-material/Add'
import FeedbackIcon from '@mui/icons-material/Feedback'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import { CircleLoading } from '~/components/CircleLoading'
import { useCustomTableFilter } from '~/components/CustomTable'
import { ModalPix } from '~/components/ModalPix'
import { SearchBar } from '~/components/SearchBar'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import type { TransferCategoryType } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { deletetCategory } from '~/services/api/category'
import { transferSubscriptions } from '~/services/api/subscriptions'

import { FormCategory, type SuccessHandler } from '../FormCategory'
import { FormTranferCategory, type FormData } from '../FormTranferCategory'

export interface ISubscriptionActions {
  editId?: number
  deleteId?: number
  paymentId?: number
  selectList?: Partial<TransferCategoryType>[]
}

type Props = {
  tournamentId: number
}
export const Actions: React.FC<Props> = ({ tournamentId }) => {
  const [tranferOpen, setTransferOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { custom, setCustom } = useTableActions<ISubscriptionActions>()
  const { emitFetch, setFilter } = useCustomTableFilter()

  const handleClose = useCallback(() => {
    setCustom({ editId: 0, deleteId: 0, paymentId: 0 })
    setTransferOpen(false)
  }, [setCustom])

  // const handleAdd = () => {
  //   setCustom({ editId: -1 })
  // }

  const handleSuccess: SuccessHandler = () => {
    toast.success('Categoria salva com sucesso')
    handleClose()
    emitFetch()
  }

  const handleClickTransfer = () => {
    setTransferOpen(true)
  }

  const handleDelete = async () => {
    if (custom?.deleteId > 0) {
      setLoading(true)
      const response = await deletetCategory(custom.deleteId)
      if (!!response.success) {
        handleClose()
        toast.success('Categoria excluída com sucesso')
        emitFetch()
      }
      setLoading(false)
    }
  }

  const handleSearchText = useCallback(
    (search?: string) => {
      setFilter({ search })
    },
    [setFilter]
  )

  const handleTransferSubmit = useCallback(
    async ({ categoryId }: FormData = {}) => {
      if (categoryId && custom?.selectList?.length) {
        const prepared = custom.selectList.map(f => ({ ...f, categoryId })) as TransferCategoryType[]
        const response = await transferSubscriptions(tournamentId, { to: prepared })
        if (response?.success) {
          toast.success('Inscrições tranferidas com sucesso')
          handleClose()
          emitFetch()
        } else {
          toast.error(response?.message || 'Erro ao tranferir')
        }
      }
    },
    [custom, tournamentId, emitFetch, handleClose]
  )

  const title = custom?.editId > 0 ? `Alterar` : `Criar`

  return (
    <>
      <FlexContainer justify="space-around">
        <div style={{ width: 360, maxWidth: '100%' }}>
          <SearchBar onChangeText={handleSearchText} />
        </div>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Badge badgeContent={custom?.selectList?.length || 0} color="primary" showZero={false}>
            <Button size="small" variant="contained" onClick={handleClickTransfer} disabled={!custom?.selectList?.length}>
              Tranferir
            </Button>
          </Badge>
          {/* <IconButton onClick={handleAdd} disabled>
            <Tooltip title="Adicionar Torneio" arrow>
              <AddIcon />
            </Tooltip>
          </IconButton> */}
        </Toolbar>
      </FlexContainer>
      <Divider />
      <Modal open={!!tranferOpen} onClose={handleClose} keepMounted={false}>
        <BoxCenter spacing={1}>
          <Card sx={{ maxWidth: '100%', minWidth: 500 }}>
            <CardHeader title={`Transferir inscrições selecionadas`} />
            <Divider />
            <CardContent>
              <FormTranferCategory tournamentId={tournamentId} onCancel={handleClose} onSubmit={handleTransferSubmit} />
            </CardContent>
          </Card>
        </BoxCenter>
      </Modal>

      <Modal open={!!custom?.editId} onClose={handleClose} keepMounted={false}>
        <BoxCenter spacing={1}>
          <Card sx={{ maxWidth: '100%', minWidth: 500 }}>
            <CardHeader title={`${title} Categoria`} />
            <Divider />
            <CardContent>
              <FormCategory tournamentId={tournamentId} categoryId={custom?.editId} onSuccess={handleSuccess} onCancel={handleClose} />
            </CardContent>
          </Card>
        </BoxCenter>
      </Modal>
      <Modal open={!!custom?.deleteId} onClose={handleClose} keepMounted={false}>
        <BoxCenter spacing={1}>
          <Card>
            <CardHeader
              title={`Removendo Categoria`}
              action={
                <Tooltip title="Mensagem de alerta">
                  <IconButton>
                    <FeedbackIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <CardContent>
              <>
                <p>
                  <Text textSize={16} align="center">
                    Todos os registros vinculados à inscrição serão excluídos permanentemente.
                  </Text>
                  <br />
                  <Text textSize={16} bold align="center">
                    Tem certeza que deseja excluir?
                  </Text>
                </p>
                {loading ? <CircleLoading /> : null}
              </>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
                <Button color="primary" variant="outlined" type="button" disabled={!!loading} onClick={handleClose}>
                  {'Cancelar'}
                </Button>
                <Button color="primary" variant="contained" type="submit" disabled={!!loading} onClick={handleDelete}>
                  {'Sim, remover'}
                </Button>
              </Stack>
            </CardActions>
          </Card>
        </BoxCenter>
      </Modal>
      <ModalPix key={`modal-pay-${custom?.paymentId}`} paymentId={custom?.paymentId} onClose={handleClose} />
    </>
  )
}
