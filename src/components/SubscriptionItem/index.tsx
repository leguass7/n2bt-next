import React, { useState } from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import PaidIcon from '@mui/icons-material/Paid'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { getTournamentImage } from '~/config/constants'
import { formatPrice } from '~/helpers'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { useAppTheme } from '../AppThemeProvider/useAppTheme'
import { CircleLoading } from '../CircleLoading'
import { FlexContainer, Text } from '../styled'
import { Partner } from '../User/SelectPartner/Partner'

type Props = ISubscription & {
  disableActions?: boolean
  onDelete?: (id: number) => Promise<any>
  onPixClick?: (id: number) => Promise<any>
}

export const SubscriptionItem: React.FC<Props> = ({ id, partner = {}, category, disableActions, onDelete, onPixClick, paymentId, paid, value }) => {
  const [loading, setLoading] = useState(false)
  const { isMobile } = useAppTheme()

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
    <Card sx={{ maxWidth: isMobile ? '100%' : 340, mb: 1 }}>
      <CardMedia component="img" image={getTournamentImage(category?.tournamentId)} alt="Live from space album cover" />
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
            {formatPrice(value || category?.price)}
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
