import React, { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import CreditScoreIcon from '@mui/icons-material/CreditScore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Modal from '@mui/material/Modal'
import Tooltip from '@mui/material/Tooltip'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { PixCode } from '~/components/PixCode'
import { BoxCenter, Text } from '~/components/styled'
import { formatPrice } from '~/helpers'
import { normalizeImageSrc, stringAvatar } from '~/helpers/string'
import type { IResponseGeneratePix } from '~/server-side/useCases/payment/payment.dto'
import { checkPayment } from '~/services/api/payment'
import { CardContainer } from '~/styles'

import { FormManualPaid } from '../FormManualPaid'
import { PaymentIcon } from '../PaymentIcon'
import type { PreparedSubscription } from './utils'

export type ItemSubscriptionProps = PreparedSubscription & {
  onClickPix?: (paymentId: number) => void
  updateListHandler?: () => void
  manualPaidHandler?: (paymentId: number) => void
}

export const ItemSubscription: React.FC<ItemSubscriptionProps> = ({
  id,
  paid,
  paymentId,
  user,
  partner,
  value,
  createdBy,
  userId,
  updateListHandler,
  payment
}) => {
  const refId = useRef(1000)
  const [openPaid, setOpenPaid] = useState<number | null>(null)
  const { theme, isMobile } = useAppTheme()
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [qrcode, setQrcode] = useState<IResponseGeneratePix>(null)

  const onReceivedPay = useCallback(
    (paid: boolean) => {
      if (!!paid && updateListHandler) updateListHandler()
    },
    [updateListHandler]
  )

  const fetchPixCode = useCallback(async (paymentId: number) => {
    setLoading(true)
    setModalOpen(true)
    const response = await checkPayment(paymentId, { fetchId: 1 })
    refId.current += 1
    const { success, message, paid, imageQrcode, qrcode } = response
    if (success) {
      if (!paid && (imageQrcode || qrcode)) {
        setQrcode({ imageQrcode, paymentId, qrcode, txid: '' })
      }
    } else {
      toast.error(message || 'Erro ao verificar pagamento')
    }
    setLoading(false)
  }, [])

  const handleModalClose = () => {
    setQrcode(null)
    setModalOpen(false)
    setOpenPaid(null)
  }

  const onManualSuccess = () => {
    updateListHandler()
    handleModalClose()
  }

  const manualPaidHandler = useCallback((paymentId: number) => {
    setOpenPaid(paymentId)
  }, [])

  const renderAvatar = () => {
    return [
      <Avatar key={`1-${user?.id}`} alt={user?.name} src={normalizeImageSrc(user?.image)}>
        {stringAvatar(user?.name)}
      </Avatar>,
      <Avatar key={`2-${user?.id}`} alt={partner?.name} src={normalizeImageSrc(partner?.image)}>
        {stringAvatar(partner?.name)}
      </Avatar>
    ]
  }

  const renderName = (name = '', nick = '', email = '') => {
    const limit = isMobile ? 20 : 27
    const len = name.length
    if (len > limit) {
      return (
        <Text title={email}>
          <>{nick ? <>{`${nick} ${name.substring(0, limit - 10)}...`}</> : <>{`${name.substring(0, limit)}...`}</>}</>
        </Text>
      )
    }

    return <Text title={email}>{name}</Text>
  }

  const paymentValue = payment?.value || value || 0

  return (
    <>
      <List disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            <>
              {createdBy !== userId && !paid ? (
                <IconButton
                  //onClick={fetchDelete}
                  title={`Deletar inscrição '${id}'`}
                  disabled={!!loading}
                >
                  <DeleteForeverIcon />
                </IconButton>
              ) : null}
              <PaymentIcon value={paymentValue} id={id} paid={!!paid} paymentId={paymentId} updateSubscriptionHandler={updateListHandler} />
              {!paid ? (
                <>
                  <Tooltip title={`Gerar pagamento${paymentValue ? ` ${formatPrice(paymentValue)}` : ''}`} arrow>
                    <IconButton onClick={() => fetchPixCode(paymentId)}>
                      <QrCode2Icon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Inserir pagamento manualmente`} arrow>
                    <IconButton onClick={() => manualPaidHandler(paymentId)} sx={{ color: theme.colors.primary }}>
                      <CreditScoreIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : null}
            </>
          }
        >
          <ListItemAvatar>
            <AvatarGroup spacing="small" max={2} total={2}>
              {renderAvatar()}
            </AvatarGroup>
          </ListItemAvatar>
          <ListItemText
            primary={renderName(user?.name, user?.nick, user?.email)}
            secondary={renderName(partner?.name, partner?.nick, partner?.email)}
            sx={{ paddingLeft: 1 }}
          />
        </ListItem>
      </List>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <BoxCenter>
          <Card sx={{ m: 1, position: 'relative' }}>
            <CardContainer>
              <PixCode
                base64QRCode={qrcode?.imageQrcode}
                stringQRCode={qrcode?.qrcode}
                onClose={handleModalClose}
                paymentId={qrcode?.paymentId}
                txid={qrcode?.txid}
                onReceivedPay={onReceivedPay}
              />
            </CardContainer>
          </Card>
        </BoxCenter>
      </Modal>
      <Modal open={!!openPaid} onClose={handleModalClose} disableEscapeKeyDown={false} keepMounted={false}>
        <BoxCenter>
          <Card>
            <CardHeader title="Inserir Pagamento" />
            <CardContent>
              <FormManualPaid paymentId={openPaid} onCancel={handleModalClose} onSuccess={onManualSuccess} />
            </CardContent>
          </Card>
        </BoxCenter>
      </Modal>
    </>
  )
}
