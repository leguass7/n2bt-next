import { useCallback, useEffect, useState } from 'react'

import ArrowBack from '@mui/icons-material/ArrowBack'
import PrintIcon from '@mui/icons-material/Print'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'

import { SimpleModal } from '~/components/Common/SimpleModal'
import { useCustomTableFilter } from '~/components/CustomTable'
import { SearchBar } from '~/components/SearchBar'
import { BoxCenter, FlexContainer } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { getRandomItem } from '~/helpers/array'
import type { IUser } from '~/server-side/useCases/user/user.dto'

import { ListDrawUsers } from '../ListDrawUsers'

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
  const [disable, setDisable] = useState(false)
  const [winner, setWinner] = useState([])

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

  const handlePrint = () => {
    push(`/admin/tournaments/presence-report/?tournamentId=${tournamentId}`)
  }

  const handleStart = () => {
    const list = custom?.userSelectedList
    const item = getRandomItem(list)
    const index = list.findIndex(l => l === item)

    setDisable(true)
    setWinner([item, index])
    // localizar nome e foto do usuário em prop `users`
  }

  const handleSuccess = useCallback(() => {
    setWinner([])
    setDisable(false)
  }, [])

  useEffect(() => {
    setCustom({ userSelectedList: users.map(u => u.id) })
  }, [setCustom, users])

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
          <IconButton onClick={handlePrint}>
            <Tooltip arrow title="Imprimir">
              <PrintIcon />
            </Tooltip>
          </IconButton>
          <IconButton onClick={handleBack}>
            <Tooltip arrow title="Voltar para torneios">
              <ArrowBack />
            </Tooltip>
          </IconButton>
        </Toolbar>
      </FlexContainer>
      <Divider />
      <SimpleModal open={!!open} onToggle={handleClose} title="Sorteio">
        <BoxCenter>
          <Alert severity="info">
            <AlertTitle>Atenção</AlertTitle>O sorteio é apenas para atletas com checkin selecionado.
          </Alert>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              disabled={!!loading || disable}
              onClick={handleStart}
              startIcon={loading ? <CircularProgress size={18} /> : null}
            >
              INICIAR
            </Button>
          </Stack>
          <div style={{ padding: '24px 0' }}>
            <ListDrawUsers winner={winner[0]} initialData={users} times={winner[1] + users?.length * 2} onSuccess={handleSuccess} />
          </div>
        </BoxCenter>
      </SimpleModal>
    </>
  )
}
