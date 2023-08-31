import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import PaidIcon from '@mui/icons-material/Paid'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { formatPrice } from '~/helpers'
import { useIsMounted } from '~/hooks/useIsMounted'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { searchPromoCode } from '~/services/api/promo-code'

import { useAppTheme } from '../AppThemeProvider/useAppTheme'
import { CircleLoading } from '../CircleLoading'
import { FlexContainer, Text } from '../styled'
import { useSubscription } from '../Subscription/SubscriptionProvider'
import { TournamentCardMedia } from '../TournamentCardMedia'
import { Partner } from '../User/SelectPartner/Partner'

type Props = ISubscription & {
  disableActions?: boolean
  onDelete?: (id: number) => Promise<any>
  onPixClick?: (id: number) => Promise<any>
}

export const SubscriptionItem: React.FC<Props> = ({ id, partner = {}, category, disableActions, onDelete, onPixClick, paymentId, paid, value }) => {
  const [loading, setLoading] = useState(false)
  const { paymentPayload } = useSubscription()
  const { isMobile } = useAppTheme()
  const { ref, width } = useResizeDetector()

  const isMounted = useIsMounted()

  const [discount, setDiscount] = useState(0)

  const promoCode = useMemo(() => {
    setDiscount(0)
    return paymentPayload?.promoCode
  }, [paymentPayload?.promoCode])

  const fetchPromoCode = useCallback(async () => {
    if (promoCode) {
      setLoading(true)
      const response = await searchPromoCode({ code: promoCode })
      if (isMounted()) {
        setLoading(false)
        setDiscount(response.promoCode?.discount)
      }
    }
  }, [promoCode, isMounted])

  useEffect(() => {
    fetchPromoCode()
  }, [fetchPromoCode])

  const priceWithDiscount = useMemo(() => {
    const discountPercentage = 1 - discount
    const price = value || category?.price
    return price * discountPercentage
  }, [discount, value, category?.price])

  const handleDelete = async () => {
    if (onDelete) {
      setLoading(true)
      const r = await onDelete(id)
      setLoading(false)
      return r
    }
  }

  const handlePix = async () => {
    if (paymentId && onPixClick) onPixClick(paymentId)
  }

  return (
    <Card ref={ref} sx={{ maxWidth: isMobile ? '100%' : 340, mb: 1 }}>
      <TournamentCardMedia tournamentId={category?.tournamentId} width={width} title={category?.title} />
      <CardContent>
        <Typography component="div" variant="h5">
          {category?.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {category?.tournament?.title}
        </Typography>
        {partner?.name ? (
          <FlexContainer justify="center" verticalPad={20}>
            <Partner {...partner} />
          </FlexContainer>
        ) : null}
        {value || category?.price ? (
          <Text bold textSize={18}>
            {!!discount ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textDecoration: 'line-through', color: '#f55' }}>{formatPrice(value || category?.price)}</span>
                  <Typography color="green" variant="caption">
                    {discount * 100}% de desconto
                  </Typography>
                </div>
                {formatPrice(priceWithDiscount || category?.price)}
                <br />
              </div>
            ) : (
              formatPrice(value || category?.price)
            )}
          </Text>
        ) : null}
      </CardContent>
      {disableActions ? null : (
        <>
          <Divider />
          <CardActions>
            {paid ? (
              <IconButton color="success">
                <Tooltip title={`Pagamento realizado${value ? ` ${formatPrice(value)}` : ''} (${paymentId})`} arrow>
                  <PaidIcon />
                </Tooltip>
              </IconButton>
            ) : (
              <>
                <IconButton onClick={handlePix}>
                  <Tooltip title={`Gerar pagamento${value ? ` ${formatPrice(value)}` : ''} (${paymentId})`} arrow>
                    <QrCode2Icon />
                  </Tooltip>
                </IconButton>
              </>
            )}
            <IconButton onClick={handleDelete} disabled={!!loading || !!paid}>
              <Tooltip title={`Remover inscrição (${id})`} arrow>
                <DeleteForeverIcon />
              </Tooltip>
            </IconButton>
          </CardActions>
        </>
      )}
      {loading ? <CircleLoading /> : null}
    </Card>
  )
}
