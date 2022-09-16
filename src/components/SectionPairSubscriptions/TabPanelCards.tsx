import React from 'react'

import Divider from '@mui/material/Divider'

import type { CategoryGender } from '~/server-side/useCases/category/category.entity'

import { SubscriptionList } from './SubscriptionList'

type TabPanelCardsProps = {
  tournamentId: number
  categoryId: number
  categoryName: string
  categoryGender: CategoryGender
  index: number
  value: number
}
export const TabPanelCards: React.FC<TabPanelCardsProps> = ({ value, index, categoryId, categoryName, categoryGender, tournamentId }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{ position: 'relative', minHeight: 120 }}
    >
      {value === index && (
        <>
          <SubscriptionList categoryId={categoryId} tournamentId={tournamentId} categoryName={categoryName} categoryGender={categoryGender} />
          <Divider />
        </>
      )}
    </div>
  )
}
