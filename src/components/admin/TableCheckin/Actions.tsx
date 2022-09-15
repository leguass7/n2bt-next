import { useCallback, useState } from 'react'

import ArrowBack from '@mui/icons-material/ArrowBack'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'

import { useCustomTableFilter } from '~/components/CustomTable'
import { SearchBar } from '~/components/SearchBar'
import { BoxCenter, FlexContainer } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { IUser } from '~/server-side/useCases/user/user.dto'

export interface ICheckinActions {
  userSelectedList?: string[]
}

type Props = {
  tournamentId: number
  users?: IUser[]
}
export const Actions: React.FC<Props> = ({ tournamentId, users = [] }) => {
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const [loading] = useState(false)
  const { custom, setCustom } = useTableActions<ICheckinActions>()
  const { setFilter } = useCustomTableFilter()

  const handleBack = () => push('/admin/tournaments')

  const handleSearchText = useCallback(
    (search?: string) => {
      setFilter({ search, tournamentId })
    },
    [setFilter, tournamentId]
  )

  const handleOpen = () => {
    setFilter({ search: '', tournamentId })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleStart = () => {
    console.log('sortear lista', custom?.userSelectedList)
    // localizar nome e foto do usuário em prop `users`
  }

  useOnceCall(() => setCustom({ userSelectedList: users.map(u => u.id) }))

  console.log('lista', custom?.userSelectedList)
  return (
    <>
      <FlexContainer justify="space-around">
        <div style={{ width: 360, maxWidth: '100%' }}>
          <SearchBar onChangeText={handleSearchText} />
        </div>
        <Toolbar sx={{ justifyContent: 'center', gap: 1 }}>
          <Badge color="primary" showZero={false} badgeContent={custom?.userSelectedList?.length}>
            <Button color={'secondary'} variant="contained" size="small" onClick={handleOpen} disabled={!!(custom?.userSelectedList?.length <= 2)}>
              SORTEIO
            </Button>
          </Badge>
          <IconButton onClick={handleBack}>
            <Tooltip arrow title="Voltar para torneios">
              <ArrowBack />
            </Tooltip>
          </IconButton>
        </Toolbar>
      </FlexContainer>
      <Divider />
      <Modal open={!!open} onClose={handleClose}>
        <BoxCenter>
          <Alert severity="info">
            <AlertTitle>Atenção</AlertTitle>O sorteio apenas para atletas com checkin selecionado.
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleClose}>
                CANCELAR
              </Button>
              <Button variant="contained" disabled={!!loading} onClick={handleStart} startIcon={loading ? <CircularProgress size={18} /> : null}>
                INICIAR
              </Button>
            </Stack>
          </Alert>
        </BoxCenter>
      </Modal>
    </>
  )
}
