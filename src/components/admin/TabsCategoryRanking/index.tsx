import React, { useState } from 'react'

import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import type { ICategory } from '~/server-side/useCases/category/category.dto'

import { TabPanel } from './TabPanel'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

type Props = {
  categories: ICategory[]
}
export const TabsCategoryRanking: React.FC<Props> = ({ categories }) => {
  const [tab, setTab] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <>
      <Tabs value={tab} onChange={handleChange} aria-label="tbs de categorias">
        {categories?.map((category, i) => {
          return <Tab key={`tab-category-${category?.id}`} label={category?.title} {...a11yProps(i)} />
        })}
      </Tabs>
      <Grid container spacing={1} role="tabpanel">
        <Grid item sm={6}>
          {categories?.map((category, i) => {
            return <TabPanel key={`tabpanel-category-${category?.id}`} value={tab} index={i} {...category} />
          })}
        </Grid>
      </Grid>
    </>
  )
}
