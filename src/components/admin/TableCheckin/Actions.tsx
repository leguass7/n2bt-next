import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import ArrowBack from '@mui/icons-material/ArrowBack'
import { Tooltip } from '@mui/material'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import { useRouter } from 'next/router'

import { useCustomTable } from '~/components/CustomTable'
import { FlexContainer } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'

export interface ICheckinActions {
  userSelectedList?: string[]
}

type Props = {
  tournamentId: number
}
export const Actions: React.FC<Props> = ({ tournamentId }) => {
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { custom, setCustom } = useTableActions<ICheckinActions>()
  const { emitFetch } = useCustomTable()

  const handleBack = () => push('/admin/tournaments')

  return (
    <>
      <FlexContainer justify="center">
        <div></div>
        <Toolbar sx={{ justifyContent: 'center', gap: 1 }}>
          <IconButton onClick={handleBack}>
            <Tooltip arrow title="Voltar para torneios">
              <ArrowBack />
            </Tooltip>
          </IconButton>
        </Toolbar>
      </FlexContainer>
      <Divider />
      {/* <Modal open={!!custom?.deleteId} onClose={handleClose}>
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
      </Modal> */}
    </>
  )
}
