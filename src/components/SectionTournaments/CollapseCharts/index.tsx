import React, { useCallback, useEffect, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

import GroupIcon from '@mui/icons-material/Group'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { FlexContainer, Paragraph, Text } from '~/components/styled'
import { darken } from '~/helpers/colors'
import { getSubscriptionSummary } from '~/services/api/subscriptions'

import { ChartContainer } from './styles'

type ChartData = {
  total?: number
  value?: number
}

type Props = {
  tournamentId: number
  expanded?: boolean
  limitUsers?: number
}
export const CollapseCharts: React.FC<Props> = ({ expanded, tournamentId, limitUsers }) => {
  const [data, setData] = useState<ChartData>({ total: 200, value: 0 })
  const { theme } = useAppTheme()
  const progressStyles = buildStyles({
    pathColor: darken(theme.colors.primary, 0.7),
    trailColor: theme.colors.text,
    textColor: theme.colors.primary,
    pathTransitionDuration: 2
  })

  const fetchData = useCallback(async () => {
    if (tournamentId && expanded) {
      const response = await getSubscriptionSummary(tournamentId)
      if (response?.success) setData(old => ({ ...old, value: response?.total || 0 }))
    }
  }, [tournamentId, expanded])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <Divider />
      <CardContent>
        <FlexContainer gap={20}>
          <ChartContainer>
            <CircularProgressbar value={data?.value} maxValue={limitUsers} text={`${data?.value}`} styles={progressStyles} />
          </ChartContainer>
          <Paragraph align="center">
            <Text textSize={26} bold>
              {data?.value}
            </Text>{' '}
            <Text textSize={18}>Inscrições realizadas</Text>
          </Paragraph>
        </FlexContainer>
      </CardContent>
      <Divider />
      <CardContent>
        <Stack direction={'row'} spacing={1} justifyContent="center" sx={{ mt: 1 }}>
          <Button href={`/tournament/subscriptions/${tournamentId}`} startIcon={<GroupIcon />}>
            Duplas inscritas {limitUsers}
          </Button>
        </Stack>
      </CardContent>
    </Collapse>
  )
}
