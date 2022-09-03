import React, { useState } from 'react'

import type { ICategory } from '~/server-side/useCases/category/category.dto'

import { TabsCategories, TabsCategoriesChange } from '../TabsCategories'
import { TabPanel } from './TabPanel'
import { TabPanelCards } from './TabPanelCards'

type Props = {
  categories: ICategory[]
  cards?: boolean
}
export const TabsSubscriptions: React.FC<Props> = ({ categories, cards }) => {
  const [tab, setTab] = useState(0)
  const handleChange: TabsCategoriesChange = (_e, newValue: number) => setTab(newValue)

  return (
    <>
      <TabsCategories tab={tab} name="sub" categories={categories} onChange={handleChange} />
      {categories?.map((category, i) => {
        return (
          <React.Fragment key={`sub-tabpanel-key-${category?.id}`}>
            {!cards ? (
              <TabPanel
                value={tab}
                index={i}
                categoryId={category?.id}
                categoryName={`${category?.title} ${category?.gender}`}
                tournamentId={category?.tournamentId}
              />
            ) : (
              <TabPanelCards
                value={tab}
                index={i}
                categoryId={category?.id}
                categoryName={`${category?.title} ${category?.gender}`}
                tournamentId={category?.tournamentId}
              />
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}
