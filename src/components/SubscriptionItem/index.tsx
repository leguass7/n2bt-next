import React from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
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
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { useAppTheme } from '../AppThemeProvider/useAppTheme'
import { FlexContainer } from '../styled'
import { Partner } from '../User/SelectPartner/Partner'

type Props = ISubscription & {
  disableActions?: boolean
}

export const SubscriptionItem: React.FC<Props> = ({ partner, category, disableActions }) => {
  const { isMobile } = useAppTheme()
  return (
    <Card sx={{ maxWidth: isMobile ? '100%' : 340, mb: 1 }}>
      {isMobile ? <CardMedia component="img" image={getTournamentImage(category?.tournamentId)} alt="Live from space album cover" /> : null}
      <CardContent>
        <Typography component="div" variant="h5">
          {category?.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {category?.tournament?.title}
        </Typography>
        <FlexContainer justify="center" verticalPad={20}>
          <Partner {...partner} />
        </FlexContainer>
      </CardContent>
      {/* <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                  <IconButton aria-label="play/pause">
                    <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                  </IconButton>
                </Box> */}

      {disableActions ? null : (
        <>
          <Divider />
          <CardActions>
            <IconButton
            //onClick={fetchPixCode(paymentId)}
            //
            >
              <Tooltip
                title="Gerar pagamento"
                //title={`Gerar pagamento${value ? ` ${formatPrice(value)}` : ''}`}
                arrow
              >
                <QrCode2Icon />
              </Tooltip>
            </IconButton>
            <IconButton>
              <Tooltip title={`Remover inscrição`} arrow>
                <DeleteForeverIcon />
              </Tooltip>
            </IconButton>
          </CardActions>
        </>
      )}
    </Card>
  )
}
