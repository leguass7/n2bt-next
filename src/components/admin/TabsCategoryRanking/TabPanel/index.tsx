import React, { useCallback, useState } from 'react'

import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { IconButton, Tooltip } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'

import { RankingList } from '~/components/admin/RankingList'
import { SearchUserDrawer, SearchFetchHandler } from '~/components/SearchUserDrawer'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import { findUser } from '~/services/api/user'

type TabPanelProps = ICategory & {
  index: number
  value: number
}
export const TabPanel: React.FC<TabPanelProps> = ({ value, index, tournamentId, id, title }) => {
  const [open, setOpen] = useState(false)

  const search: SearchFetchHandler = useCallback(async filter => {
    const response = await findUser(filter)
    return response
  }, [])

  const handleClickAdd = () => {
    setOpen(true)
  }

  return (
    <>
      <Card role="tabpanel" id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} hidden={value !== index}>
        <CardHeader
          title={`Ranking - ${title}`}
          action={
            <Tooltip title="Adicionar atleta" arrow>
              <IconButton size="large" onClick={handleClickAdd}>
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <CardContent>{value === index && <RankingList tournamentId={tournamentId} categoryId={id} />}</CardContent>
      </Card>
      <SearchUserDrawer open={open} onClose={() => setOpen(false)} fetcher={search} fixedFilter={{ tournamentId, categoryId: id }} />
    </>
  )
}
