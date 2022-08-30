import React, { useState } from 'react'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import type { ICategory } from '~/server-side/useCases/category/category.dto'

import { TabPanel } from './TabPanel'

function a11yProps(index: number) {
  return {
    id: `sub-tab-${index}`,
    'aria-controls': `sub-tabpanel-${index}`
  }
}

type Props = {
  categories: ICategory[]
}
export const TabsSubscriptions: React.FC<Props> = ({ categories }) => {
  const [tab, setTab] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <>
      <Tabs value={tab} onChange={handleChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
        {categories?.map((category, i) => {
          return <Tab key={`tab-category-${category?.id}`} label={category?.title} {...a11yProps(i)} />
        })}
      </Tabs>
      {categories?.map((category, i) => {
        return <TabPanel key={`tabpanel-category-${category?.id}`} value={tab} index={i} categoryId={category?.id} categoryName={category?.title} />
      })}
    </>
  )
}
