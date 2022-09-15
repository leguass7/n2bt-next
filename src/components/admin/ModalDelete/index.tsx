import React from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'

import { CircleLoading } from '~/components/CircleLoading'
import { BoxCenter, Text } from '~/components/styled'

type Props = {
  open?: boolean
  loading?: boolean
  title?: string
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>
  onCancel?: () => void
  message?: string
}
export const ModalDelete: React.FC<Props> = ({ loading, open, title = 'Removendo', onConfirm, onCancel, message = '' }) => {
  return (
    <Modal open={!!open} onClose={onCancel} keepMounted={false}>
      <BoxCenter spacing={1}>
        <Alert>
          <AlertTitle>{title}</AlertTitle>
          {message}
          <br />
          <Text textSize={16} bold>
            Tem certeza que deseja excluir?
          </Text>
          <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
            <Button color="primary" variant="outlined" type="button" disabled={!!loading} onClick={onCancel}>
              {'Cancelar'}
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={!!loading} onClick={onConfirm}>
              {'Sim, remover'}
            </Button>
          </Stack>
        </Alert>
        {loading ? <CircleLoading /> : null}
      </BoxCenter>
    </Modal>
  )
}
