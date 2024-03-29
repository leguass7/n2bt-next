import React, { useState } from 'react'
import { toast } from 'react-toastify'

import AddIcon from '@mui/icons-material/Add'
import FeedbackIcon from '@mui/icons-material/Feedback'
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
import { useCustomTable } from '~/components/CustomTable'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { deletetArena } from '~/services/api/arena'

import { FormArena, type SuccessHandler } from '../FormArena'

export interface IArenaActions {
  editId?: number
  deleteId?: number
}

export const Actions: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { custom, setCustom } = useTableActions<IArenaActions>()
  const { emitFetch } = useCustomTable()

  const handleClose = () => {
    setCustom({ editId: 0, deleteId: 0 })
  }

  const handleAdd = () => {
    setCustom({ editId: -1 })
  }

  const handleSuccess: SuccessHandler = () => {
    toast.success('Arena salva com sucesso')
    handleClose()
    emitFetch()
  }

  const handleDelete = async () => {
    if (custom?.deleteId > 0) {
      setLoading(true)
      const response = await deletetArena(custom.deleteId)
      if (!!response.success) {
        handleClose()
        toast.success('Arena excluída com sucesso')
        emitFetch()
      }
      setLoading(false)
    }
  }

  const title = custom?.editId > 0 ? `Alterar` : `Criar`

  return (
    <>
      <FlexContainer justify="space-between">
        <Text textSize={18} bold horizontalPad={10}>
          Arenas cadastradas
        </Text>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Tooltip title="Adicionar Arena" arrow>
            <IconButton onClick={handleAdd}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </FlexContainer>
      <Divider />
      <Modal open={!!custom?.editId} onClose={handleClose} keepMounted={false}>
        <BoxCenter spacing={1}>
          <Card>
            <CardHeader title={`${title} Arena`} />
            <Divider />
            <CardContent>
              <FormArena onCancel={handleClose} arenaId={custom?.editId} onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </BoxCenter>
      </Modal>
      <Modal open={!!custom?.deleteId} onClose={handleClose} keepMounted={false}>
        <BoxCenter spacing={1}>
          <Card>
            <CardHeader
              title={`Removendo Arena`}
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
                    Todos os registros vinculados à arena serão excluídos permanentemente.
                  </Text>
                  <br />
                  <Text textSize={16} bold align="center">
                    Tem certeza que deseja excluir arenas?
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
    </>
  )
}
