import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'

import type { ICategory } from '~/server-side/useCases/category/category.dto'

type TabPanelProps = ICategory & {
  index: number
  value: number
}
export const TabPanel: React.FC<TabPanelProps> = ({ value, index, tournamentId, id }) => {
  return (
    <>
      <Card role="tabpanel" id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} hidden={value !== index}>
        <CardHeader title={`Ranking do torneio ${index}`} />
        <Divider />
        <CardContent>
          {value === index && (
            <>
              <p>Mostrar ranking {tournamentId}</p>
              <p>categoria {id}</p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
