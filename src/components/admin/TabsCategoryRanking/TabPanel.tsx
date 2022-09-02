import React from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'

import { TableRanking } from '~/components/admin/TableRanking'

type TabPanelProps = {
  tournamentId: number
  categoryId: number
  categoryName: string
  index: number
  value: number
}
export const TabPanel: React.FC<TabPanelProps> = ({ value, index, categoryId, categoryName, tournamentId }) => {
  const { push } = useRouter()
  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`}>
      {value === index && (
        <Card sx={{ overflowX: 'auto', maxWidth: '100%' }}>
          <CardHeader
            subheader={`Ranking - ${categoryName}`}
            action={
              <Toolbar sx={{ justifyContent: 'flex-end' }}>
                <Tooltip title="Voltar" arrow>
                  <IconButton size="large" onClick={() => push('/admin/tournaments')}>
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            }
          />
          <Divider />
          <TableRanking categoryId={categoryId} tournamentId={tournamentId} />
        </Card>
      )}
    </div>
  )
}
