import React from 'react'
import { toast } from 'react-toastify'

import { Refresh } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Divider, IconButton, Toolbar, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'

import { FormPromoCode, SuccessHandler } from '~/components/admin/FormPromoCode'
import { SimpleModal } from '~/components/Common/SimpleModal'
import { useCustomTableFilter } from '~/components/CustomTable'
import { FlexContainer, Text } from '~/components/styled'
import { useTableActions } from '~/components/tables/TableActionsProvider'

export interface IPromoCodeActions {
  editId?: number
  deleteId?: number
}

type Props = {
  tournamentId: number
}

export const Actions: React.FC<Props> = ({ tournamentId }) => {
  const { custom, setCustom } = useTableActions<IPromoCodeActions>()
  const { emitFetch } = useCustomTableFilter()
  const { push } = useRouter()

  const handleClose = () => {
    setCustom({ editId: 0, deleteId: 0 })
  }

  const handleClickAdd = () => {
    setCustom({ editId: -1 })
  }

  const handleBack = () => push('/admin/tournaments')

  const handleSuccess: SuccessHandler = () => {
    toast.success('Código promocional salvo com sucesso')
    handleClose()
    emitFetch()
  }

  const title = custom?.editId > 0 ? `Alterar` : `Criar`

  return (
    <>
      <FlexContainer justify="space-between">
        <div>
          <Text textSize={18} bold horizontalPad={10}>
            Códigos promocionais
          </Text>
        </div>
        <Toolbar>
          <IconButton onClick={emitFetch}>
            <Tooltip title="Atualizar lista" arrow>
              <Refresh />
            </Tooltip>
          </IconButton>
          <IconButton onClick={handleClickAdd}>
            <Tooltip title="Adicionar Código" arrow>
              <AddIcon />
            </Tooltip>
          </IconButton>
          <IconButton onClick={handleBack}>
            <Tooltip title="Voltar para torneios" arrow>
              <ArrowBackIcon />
            </Tooltip>
          </IconButton>
        </Toolbar>
      </FlexContainer>
      <Divider />
      <SimpleModal title={`${title} código promocional`} open={!!custom?.editId} onToggle={handleClose}>
        <FormPromoCode tournamentId={tournamentId} onSuccess={handleSuccess} onCancel={handleClose} />
      </SimpleModal>
    </>
  )
}
