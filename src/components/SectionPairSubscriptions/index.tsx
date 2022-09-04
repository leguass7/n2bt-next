import React, { useState } from 'react'

import type { ICategory } from '~/server-side/useCases/category/category.dto'
import type { CategoryGender } from '~/server-side/useCases/category/category.entity'

import { TabPanelCards } from './TabPanelCards'
import { TabsCategories, TabsCategoriesChange } from './TabsCategories'

type Props = {
  categories?: Partial<ICategory>[]
}
export const SectionPairSubscriptions: React.FC<Props> = ({ categories }) => {
  const [tab, setTab] = useState(0)
  const handleChange: TabsCategoriesChange = (_e, newValue: number) => setTab(newValue)

  const catLabels = {
    M: 'Masculino',
    F: 'Feminino',
    MF: ''
  }

  return (
    <>
      <TabsCategories categories={categories} tab={tab} name="sub-cat" onChange={handleChange} />
      {categories?.map((category, i) => {
        return (
          <React.Fragment key={`sub-tabpanel-key-${category?.id}`}>
            <TabPanelCards
              value={tab}
              index={i}
              categoryId={category?.id}
              categoryName={`${category?.title} ${catLabels[category.gender]}`}
              categoryGender={category?.gender as CategoryGender}
              tournamentId={category?.tournamentId}
            />
          </React.Fragment>
        )
      })}
    </>
  )
}
