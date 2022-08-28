import React, { useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'

import CheckIcon from '@mui/icons-material/Check'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolltip from '@mui/material/Tooltip'

import { CircleLoading } from '~/components/CircleLoading'
import { FlexContainer, H4, Paragraph, Text } from '~/components/styled'
import { checkPayment } from '~/services/api/payment'

import { PixContainer, QrcodeContainer, QrCodeHeader, QrcodeImage } from './styles'

type Props = {
  stringQRCode?: string
  base64QRCode?: string
  purchaseId?: number
  paymentId?: number
  txid?: string
  onClose?: () => void
  onReceivedPay?: (paid?: boolean) => void
  fetchId?: number
}

export const PixCode: React.FC<Props> = ({ base64QRCode, stringQRCode, paymentId, onClose, onReceivedPay, fetchId = 0 }) => {
  const refId = useRef(fetchId)
  const [tipOpen, setTipOpen] = useState(false)
  const [receivedPay, setReceivedPay] = useState(false)

  useEffect(() => {
    let invervalId: any
    if (paymentId && !receivedPay) {
      invervalId = setInterval(() => {
        refId.current += 1
        checkPayment(paymentId, { disableqrcode: true, fetchId: refId.current }).then(res => {
          setReceivedPay(!!res?.paid)
          if (onReceivedPay) onReceivedPay(!!res?.paid)
        })
      }, 10000)
    }

    return () => {
      clearInterval(invervalId)
    }
  }, [paymentId, receivedPay, onReceivedPay])

  const handleClickCopy = () => {
    if (stringQRCode) navigator?.clipboard?.writeText(stringQRCode)
    setTipOpen(true)
  }

  const handleClose = () => {
    if (onClose) onClose()
    setTipOpen(false)
  }

  return (
    <PixContainer>
      <QrcodeContainer>
        {onClose ? (
          <QrCodeHeader>
            <IconButton onClick={handleClose}>
              <IoClose />
            </IconButton>
          </QrCodeHeader>
        ) : null}
        {!receivedPay ? (
          <>
            <FlexContainer justify="center" verticalPad={16}>
              <H4>QRCode para pagamento via PIX</H4>
            </FlexContainer>
            {base64QRCode ? (
              <>
                <QrcodeImage src={base64QRCode} alt="QRCODE" />
                {stringQRCode ? (
                  <>
                    <FlexContainer justify="center" verticalPad={10}>
                      <Toolltip
                        open={!!tipOpen}
                        title="Código copiado. Agora cole no seu aplicativo de pagamento"
                        placement="bottom"
                        arrow
                        onMouseLeave={() => setTipOpen(false)}
                      >
                        <Button variant="outlined" onClick={handleClickCopy}>
                          COPIA E COLA
                        </Button>
                      </Toolltip>
                    </FlexContainer>
                    <Paragraph align="center" textSize={12}>
                      <code style={{ maxWidth: '100%', wordBreak: 'break-word' }}>{stringQRCode}</code>
                    </Paragraph>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <Paragraph align="center">Aguardando informações</Paragraph>
                <CircleLoading />
              </>
            )}
          </>
        ) : (
          <Paragraph align="center">
            <Text textSize={18} align="center">
              <CheckIcon /> PAGAMENTO REALIZADO
            </Text>
            <br />
            <Text align="center" textSize={18}>
              Inscrição concluída com sucesso. Até já{' '}
              <span role="img" aria-label="sheep">
                👍
              </span>
            </Text>
          </Paragraph>
        )}
      </QrcodeContainer>
    </PixContainer>
  )
}
