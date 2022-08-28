import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { CircleLoading } from '~/components/CircleLoading'
import { FlexContainer, Text } from '~/components/styled'
import { Partner } from '~/components/User/SelectPartner/Partner'
import { getTournamentImage } from '~/config/constants'

import { useSubscription } from '../../SubscriptionProvider'

export const Summary: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { category, partner, saveSubscription, subscription } = useSubscription()
  const { isMobile } = useAppTheme()

  const handleGenerateClick = async () => {
    if (!subscription?.id) {
      setLoading(true)
      await saveSubscription()
      setLoading(false)
    }
  }

  return (
    <>
      <FlexContainer justify="center" verticalPad={20}>
        <Text align="center" transform="uppercase">
          <Text align="center">
            Confira sua inscrição e clique <Text bold>GERAR PAGAMENTO</Text>
          </Text>
        </Text>
      </FlexContainer>
      <br />
      <br />
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
      <FlexContainer justify="center" verticalPad={20} onClick={handleGenerateClick}>
        <Button variant="outlined">GERAR PAGAMENTO</Button>
      </FlexContainer>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
