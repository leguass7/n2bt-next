import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import AddIcon from '@mui/icons-material/Add'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'

import { CircleLoading } from '~/components/CircleLoading'
import { useCustomTable } from '~/components/CustomTable'
import { type SearchFetchHandler, SearchUserDrawer, type SelectHandler } from '~/components/SearchUserDrawer'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { autoGenerateRanking, storeRanking } from '~/services/api/ranking'
import { deleteRanking } from '~/services/api/ranking'
import { findUser } from '~/services/api/user'

import { FormRanking, type SuccessHandler } from '../FormRanking'

export interface IRankingActions {
  editId?: number
  deleteId?: number
  paymentId?: number
  selectList?: number[]
}

type Props = {
  tournamentId: number
  categoryId: number
  userList: string[]
}
export const Actions: React.FC<Props> = ({ tournamentId, categoryId, userList }) => {
  const [open, setOpen] = useState(false)
  const [, setAdded] = useState('-')
  const [loading, setLoading] = useState(false)
  const { custom, setCustom } = useTableActions<IRankingActions>()
  const { emitFetch } = useCustomTable()

  const handleClose = useCallback(() => {
    setCustom({ editId: 0, deleteId: 0, paymentId: 0 })
    setOpen(false)
  }, [setCustom])

  const search: SearchFetchHandler = useCallback(async filter => {
    const response = await findUser(filter)
    return response
  }, [])

  const handleSelect: SelectHandler = useCallback(
    async userId => {
      const response = await storeRanking({ tournamentId, categoryId, userId })
      if (!!response?.success) {
        setAdded(userId)
        toast.success('Usuário adicionado')
        emitFetch()
      } else {
        toast.error('Erro ao salvar')
      }
    },
    [tournamentId, categoryId, emitFetch]
  )

  const handleDelete = async () => {
    if (custom?.deleteId > 0) {
      setLoading(true)
      const response = await deleteRanking(custom.deleteId)
      if (!!response.success) {
        handleClose()
        toast.success('Ranking excluído com sucesso')
        emitFetch()
      }
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    const response = await autoGenerateRanking(categoryId)
    setLoading(false)
    if (!response?.success) {
      toast.error(response?.message || 'Erro ao gerar')
    } else {
      toast.success('Ranking gerado com sucesso')
      emitFetch()
    }
  }

  const handleSuccess: SuccessHandler = () => {
    toast.success('Ranking salvo com sucesso')
    handleClose()
    emitFetch()
  }

  const handleDeleteBulk = async () => {
    setLoading(true)
    await Promise.all(
      custom?.selectList?.map(async deleteId => {
        const r = await deleteRanking(deleteId)
        if (!r?.success) toast.error(r?.message || `Erro ao excluir ${deleteId}`)
        return r
      })
    )
    setLoading(false)
    setCustom({ selectList: [] })
    emitFetch()
  }

  const handleClickAdd = () => setOpen(true)

  const title = custom?.editId > 0 ? `Alterar` : `Criar`

  return (
    <>
      <FlexContainer justify="center">
        <div></div>
        <Toolbar sx={{ justifyContent: 'center', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleClickAdd}
            endIcon={loading ? <CircularProgress size={12} /> : <AddIcon fontSize="small" />}
          >
            Adicionar
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            endIcon={loading ? <CircularProgress size={12} /> : <AutoFixHighIcon fontSize="small" />}
            onClick={handleGenerate}
            disabled={!!loading}
          >
            Gerar
          </Button>
          <Badge badgeContent={custom?.selectList?.length || 0} color="error" showZero={false}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleDeleteBulk}
              disabled={!custom?.selectList?.length}
              endIcon={loading ? <CircularProgress size={12} /> : <DeleteForeverIcon fontSize="small" />}
            >
              Excluir
            </Button>
          </Badge>
        </Toolbar>
      </FlexContainer>
      <Divider />
      <SearchUserDrawer
        open={open}
        categoryId={categoryId}
        tournamentId={tournamentId}
        onClose={handleClose}
        fetcher={search}
        fixedFilter={{ tournamentId, categoryId }}
        userList={userList}
        onSelect={handleSelect}
      />
      <Modal open={!!custom?.editId} onClose={handleClose} keepMounted={false}>
        <BoxCenter spacing={1}>
          <Card sx={{ maxWidth: '100%', width: 500 }}>
            <CardHeader title={`${title} Ranking`} />
            <Divider />
            <CardContent>
              <FormRanking rankingId={custom?.editId} onSuccess={handleSuccess} onCancel={handleClose} />
            </CardContent>
          </Card>
        </BoxCenter>
      </Modal>
      <Modal open={!!custom?.deleteId} onClose={handleClose}>
        <BoxCenter>
          <Alert severity="warning">
            <AlertTitle>Atenção</AlertTitle>O Registro será excluído permanentemente.
            <br />
            <Text bold>Tem certeza que deseja excluir?</Text>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleClose}>
                CANCELAR
              </Button>
              <Button variant="contained" onClick={handleDelete} disabled={!!loading} startIcon={loading ? <CircleLoading size={18} /> : null}>
                SIM, REMOVER
              </Button>
            </Stack>
          </Alert>
        </BoxCenter>
      </Modal>
    </>
  )
}
