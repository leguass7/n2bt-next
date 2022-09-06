import React, { useCallback, useState } from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'

import { FlexContainer, Paragraph, Text } from '~/components/styled'

import { SubscriptionList, OnLoadHanlder, OnLoadParams } from '../SubscriptionList/index'

type TabPanelCardsProps = {
  tournamentId: number
  categoryId: number
  categoryName: string
  index: number
  value: number
}
export const TabPanelCards: React.FC<TabPanelCardsProps> = ({ value, index, categoryId, categoryName, tournamentId }) => {
  const [total, setTotal] = useState<OnLoadParams>(null)
  const { push } = useRouter()

  const onLoad: OnLoadHanlder = useCallback(params => {
    setTotal(params)
  }, [])

  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`}>
      {value === index && (
        <>
          <FlexContainer>
            <Paragraph align="center" verticalSpaced>
              Inscrições - {categoryName}
              {total ? (
                <>
                  <br />
                  <Text>
                    <Text bold>{total.pairs}</Text> duplas,
                  </Text>{' '}
                  <Text>
                    <Text bold>{total.users}</Text> inscrições
                  </Text>
                </>
              ) : null}
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
          <SubscriptionList categoryId={categoryId} tournamentId={tournamentId} onLoad={onLoad} />
        </>
      )}
    </div>
  )
}
