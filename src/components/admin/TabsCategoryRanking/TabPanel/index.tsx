import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'

import { OnFetchDataHandler, RankingList } from '~/components/admin/RankingList'
import { SearchUserDrawer, SearchFetchHandler, SelectHandler } from '~/components/SearchUserDrawer'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import { storeRanking } from '~/services/api/ranking'
import { findUser } from '~/services/api/user'

type TabPanelProps = ICategory & {
  index: number
  value: number
}
export const TabPanel: React.FC<TabPanelProps> = ({ value, index, tournamentId, id, title }) => {
  const { push } = useRouter()
  const [added, setAdded] = useState('-')
  const [userList, setUserList] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const search: SearchFetchHandler = useCallback(async filter => {
    const response = await findUser(filter)
    return response
  }, [])

  const handleSelect: SelectHandler = useCallback(
    async userId => {
      const response = await storeRanking({ tournamentId, categoryId: id, userId })
      if (!!response?.success) {
        setAdded(userId)
        toast.success('Usuário adicionado')
      } else {
        toast.error('Erro ao salvar')
      }
    },
    [tournamentId, id]
  )

  const handleClickAdd = () => {
    setOpen(true)
  }

  const onFecthList: OnFetchDataHandler = useCallback(list => {
    setUserList(list)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])
  return (
    <>
      <Card role="tabpanel" id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} hidden={value !== index}>
        <CardHeader
          title={`Ranking - ${title}`}
          action={
            <Toolbar sx={{ justifyContent: 'flex-end' }}>
              <Tooltip title="Adicionar atleta" arrow>
                <IconButton size="large" onClick={() => push('/admin/tournaments')}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Adicionar atleta" arrow>
                <IconButton size="large" onClick={handleClickAdd}>
                  <PersonAddIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          }
        />
        <Divider />
        <CardContent>
          {value === index && <RankingList key={`added-${added}`} tournamentId={tournamentId} categoryId={id} onFetchData={onFecthList} />}
        </CardContent>
      </Card>
      <SearchUserDrawer
        open={open}
        categoryId={id}
        tournamentId={tournamentId}
        onClose={handleClose}
        fetcher={search}
        fixedFilter={{ tournamentId, categoryId: id }}
        userList={userList}
        onSelect={handleSelect}
      />
    </>
  )
}
