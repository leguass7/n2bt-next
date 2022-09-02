import React, { useState } from 'react'

import type { ICategory } from '~/server-side/useCases/category/category.dto'

import { TabsCategories, TabsCategoriesChange } from '../TabsCategories'
import { TabPanel } from './TabPanel'

type Props = {
  categories: ICategory[]
}
export const TabsCategoryRanking: React.FC<Props> = ({ categories }) => {
  const [tab, setTab] = useState(0)
  const handleChange: TabsCategoriesChange = (_e, newValue: number) => setTab(newValue)

  return (
    <>
      <TabsCategories tab={tab} name="rank" categories={categories} onChange={handleChange} />
      {categories?.map((category, i) => {
        return (
          <TabPanel
            key={`rank-tabpanel-key-${category?.id}`}
            value={tab}
            index={i}
            categoryId={category?.id}
            categoryName={`${category?.title} ${category?.gender}`}
            tournamentId={category?.tournamentId}
          />
        )
      })}
    </>
  )
}
