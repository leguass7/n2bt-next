import React, { useState } from 'react'

import { Alert, AlertTitle, Button, Stack } from '@mui/material'

import { useTableActions } from '~/components/tables/TableActionsProvider'
import type { IResponsePromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'
import { deletePromoCode } from '~/services/api/promo-code'

import type { IPromoCodeActions } from './Actions'

type Props = {
  onSuccess?: (response?: IResponsePromoCode) => void
  onClose: () => void
}

export const RemoveAction: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const { custom } = useTableActions<IPromoCodeActions>()

  const handleDelete = async () => {
    if (custom?.deleteId > 0) {
      setLoading(true)
      const response = await deletePromoCode(custom.deleteId)
      setLoading(false)
      if (!!response.success) {
        if (onSuccess) onSuccess(response)
        else if (onClose) onClose()
      }
    }
  }

  return (
    <div>
      <p>
        <Alert variant="filled" severity="warning">
          <AlertTitle>Você tem certeza que deseja remover?</AlertTitle>
          Ao remover o código promocional, os links de promoção compartilhados deixarão de funcionar.
        </Alert>
      </p>
      <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
        {onClose ? (
          <Button color="primary" variant="outlined" type="button" disabled={!!loading} onClick={onClose}>
            {'Cancelar'}
          </Button>
        ) : null}
        <Button color="error" variant="contained" type="submit" disabled={!!loading} onClick={handleDelete}>
          {'Sim, remover'}
        </Button>
      </Stack>
    </div>
  )
}
