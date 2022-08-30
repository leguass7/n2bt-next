import React from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'

import { TableSubscriptions } from '../TableSubscriptions'

type TabPanelProps = {
  categoryId: number
  categoryName: string
  index: number
  value: number
}
export const TabPanel: React.FC<TabPanelProps> = ({ value, index, categoryId, categoryName }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`}>
      {value === index && (
        <Card sx={{ overflowX: 'auto', maxWidth: '100%' }}>
          <CardHeader subheader={categoryName} />
          <Divider />
          <TableSubscriptions categoryId={categoryId} />
        </Card>
      )}
    </div>
  )
}
