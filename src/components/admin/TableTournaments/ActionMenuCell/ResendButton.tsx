import { useState } from 'react'

import CheckIcon from '@mui/icons-material/Check'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { CircularProgress } from '@mui/material'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useSnackbar } from 'notistack'

import { useSocketRegister } from '~/components/SocketProvider/useSocket'
import { useTranslateError } from '~/components/Translation/useTranslateError'
import { ReceiveEmailDto } from '~/hooks/socket/server-to-client.dto'
import { resendEmailOfLink } from '~/services/ServerApi/company/passport/inventory'

import { BoxResendView } from '../styled'

type Props = {
  sentCount?: number
  passportId: number
  inventoryId: number
  countLimit?: number
  disabled?: boolean
}

interface ResendViewProps {
  type: ReceiveEmailDto['action']
  loading: boolean
}

const ResendView: React.FC<ResendViewProps> = ({ type, loading }) => {
  return (
    <>
      {loading ? (
        <CircularProgress sx={{ position: 'absolute' }} size={12} />
      ) : (
        <BoxResendView>
          <CheckIcon fontSize="small" color={type === 'sent' || type === 'readed' ? 'success' : 'inherit'} />
          <CheckIcon fontSize="small" color={type === 'readed' ? 'success' : 'inherit'} />
        </BoxResendView>
      )}
    </>
  )
}

export const ResendButton: React.FC<Props> = ({ passportId, inventoryId, sentCount = 1, countLimit = 3, disabled }) => {
  const [count, setCount] = useState(sentCount)
  const { enqueueSnackbar } = useSnackbar()
  const [socketRegister] = useSocketRegister('email', 'default')
  const [emailId, setEmailId] = useState('')
  const [action, setAction] = useState<ReceiveEmailDto['action']>(null)
  const [loading, setLoading] = useState(false)
  const { parseError } = useTranslateError()

  const countOverLimit = count === countLimit

  const handleResend = async () => {
    setLoading(true)
    const response = await resendEmailOfLink(passportId, inventoryId)
    setLoading(false)
    if (response?.success) {
      setEmailId(response?.emailId)

      enqueueSnackbar('Envio de Passaporte agendado com sucesso', { variant: 'success' })

      setCount(old => old + 1)
    } else {
      enqueueSnackbar(parseError(response?.message), { variant: 'error' })
    }
  }

  socketRegister(data => {
    if (data.emailId === emailId) {
      setLoading(false)
      setAction(data.action)
    }
  })

  const tooltip = () => {
    if (loading) {
      return 'Solicitando envio de Passaporte'
    }

    if (action === 'sent') {
      return 'Email enviado'
    }

    if (action === 'readed') {
      return 'Email lido'
    }

    return countOverLimit ? `Máximo de ${countLimit} reenvios atingido` : 'Reenviar passaporte'
  }

  const disabledButton = !!(!!disabled || !!(count >= countLimit)) || !!action
  return (
    <Tooltip title={tooltip()} arrow>
      <Badge
        key={inventoryId}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={!!action || loading ? <ResendView loading={loading} type={action} /> : count}
      >
        <IconButton disabled={disabledButton} onClick={handleResend} size="small">
          <ForwardToInboxIcon />
        </IconButton>
      </Badge>
    </Tooltip>
  )
}
