import React from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

import { getTournamentImage } from '~/config/constants'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

import { useAppTheme } from '../AppThemeProvider/useAppTheme'
import { FlexContainer } from '../styled'
import { Partner } from '../User/SelectPartner/Partner'

// import { Container } from './styles';
type Props = ISubscription & {}

export const SubscriptionItem: React.FC<Props> = ({ partner, category }) => {
  const { isMobile } = useAppTheme()
  return (
    <Card sx={{ display: 'flex', width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
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
      </Box>

      {!isMobile ? (
        <CardMedia component="img" sx={{ width: 151 }} image={getTournamentImage(category?.tournamentId)} alt="Live from space album cover" />
      ) : null}
    </Card>
  )
}
