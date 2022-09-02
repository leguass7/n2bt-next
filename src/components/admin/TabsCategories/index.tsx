import React from 'react'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import type { ICategory } from '~/server-side/useCases/category/category.dto'

function a11yProps(index: number, name: string) {
  return {
    id: `${name}-tab-${index}`,
    'aria-controls': `tabpanel-${name}-${index}`
  }
}

export type TabsCategoriesChange = (event: React.SyntheticEvent<Element, Event>, value: number) => any

type Props = {
  name: string
  categories?: Partial<ICategory>[]
  onChange?: TabsCategoriesChange
  tab: number
}

export const TabsCategories: React.FC<Props> = ({ name, categories = [], onChange, tab }) => {
  return (
    <Tabs value={tab} onChange={onChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
      {categories?.map((category, i) => {
        const label = `${category?.title} ${category?.gender}`
        return <Tab key={`tab-category-${category?.id}`} label={label} {...a11yProps(i, name)} />
      })}
    </Tabs>
  )
}
