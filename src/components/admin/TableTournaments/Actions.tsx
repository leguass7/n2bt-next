import React, { useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
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

import { useAdminArena } from '~/components/app/LayoutAdmin/LayoutAdminProvider'
import { CircleLoading } from '~/components/CircleLoading'
import { useCustomTable } from '~/components/CustomTable'
import { Main, SliderItem } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { deletetTournament } from '~/services/api/tournament'

import { FormTournament, type SuccessHandler } from '../FormTournament'
import { UploadImage } from '../FormTournament/UploadImage'

export interface ITournamentActions {
  editId?: number
  deleteId?: number
}

export const Actions: React.FC = () => {
  const [arenaId] = useAdminArena()
  const [loading, setLoading] = useState(false)
  const { custom, setCustom } = useTableActions<ITournamentActions>()
  const { emitFetch } = useCustomTable()

  const handleClose = () => {
    setCustom({ editId: 0, deleteId: 0 })
  }

  const handleAdd = () => {
    setCustom({ editId: -1 })
  }

  const handleSuccess: SuccessHandler = () => {
    toast.success('Torneio salvo com sucesso')
    handleClose()
    emitFetch()
  }

  const handleDelete = async () => {
    if (custom?.deleteId > 0) {
      setLoading(true)
      const response = await deletetTournament(custom.deleteId)
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
          Torneios cadastrados
        </Text>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Tooltip title="Adicionar Torneio" arrow>
            <IconButton onClick={handleAdd}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </FlexContainer>
      <Divider />
      <Modal open={!!custom?.editId} onClose={handleClose} keepMounted={false}>
        <BoxCenter spacing={1}>
          <Card sx={{ maxHeight: '90vh' }}>
            <PerfectScrollbar>
              <CardHeader title={`${title} Torneio`} />
              <Divider />
              <CardContent>
                <Main name="form-tournament">
                  <SliderItem>
                    <FormTournament arenaId={arenaId} tournamentId={custom?.editId} onSuccess={handleSuccess} onCancel={handleClose} />
                  </SliderItem>
                  <SliderItem>
                    <UploadImage tournamentId={custom?.editId} />
                  </SliderItem>
                </Main>
              </CardContent>
            </PerfectScrollbar>
          </Card>
        </BoxCenter>
      </Modal>
      <Modal open={!!custom?.deleteId} onClose={handleClose} keepMounted={false}>
        <BoxCenter spacing={1}>
          <Card>
            <CardHeader
              title={`Removendo Torneio`}
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
                    Todos os registros vinculados ao torneio serão excluídos permanentemente.
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
    </>
  )
}
