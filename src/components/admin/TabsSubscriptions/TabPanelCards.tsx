import React from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'

import { FlexContainer, Paragraph } from '~/components/styled'

import { SubscriptionList } from '../SubscriptionList'

type TabPanelCardsProps = {
  tournamentId: number
  categoryId: number
  categoryName: string
  index: number
  value: number
}
export const TabPanelCards: React.FC<TabPanelCardsProps> = ({ value, index, categoryId, categoryName, tournamentId }) => {
  const { push } = useRouter()
  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`}>
      {value === index && (
        <>
          <FlexContainer>
            <Paragraph align="center" verticalSpaced>
              Inscrições - {categoryName}
            </Paragraph>
            <Toolbar sx={{ justifyContent: 'flex-end' }}>
              <Tooltip title="Voltar para torneios" arrow>
                <IconButton size="large" onClick={() => push('/admin/tournaments')}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </FlexContainer>
          <Divider />
          <SubscriptionList categoryId={categoryId} tournamentId={tournamentId} />
        </>
      )}
    </div>
  )
}
