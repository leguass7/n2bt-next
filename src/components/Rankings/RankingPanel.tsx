import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { isPast, parseJSON } from 'date-fns'
import { useRouter } from 'next/router'
import gfm from 'remark-gfm'

import { compareValues } from '~/helpers/array'
import { useIsMounted } from '~/hooks/useIsMounted'
import { ICategory } from '~/server-side/useCases/category/category.dto'
import { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { listCategories } from '~/services/api/category'
import { Content } from '~/styles'

import { CircleLoading } from '../CircleLoading'
import { ITab, SimpleTab } from '../Common/SimpleTab'
import { MkContainer } from '../styled'
import { ListPartners } from '../User/ListPartners'
import { RankingList } from './RankingList'

function categoriesDto(cats: ICategory[]): ICategory[] {
  return cats.filter(f => f?.gender?.toUpperCase() !== 'MF')
}

const constGender = {
  M: 'Masculina',
  F: 'Feminina',
  MF: 'Mista'
}
interface Props {
  tournamentId: number
  tournament?: ITournament
}

export const RankingPanel: React.FC<Props> = ({ tournamentId, tournament = {} }) => {
  const { push } = useRouter()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [categoryId, setCategoryId] = useState<number>(null)

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const expired = tournament?.expires && isPast(parseJSON(tournament?.expires))

  const fetchCategories = useCallback(async () => {
    if (!tournamentId) return
    setLoading(true)
    const res = await listCategories(tournamentId)
    if (isMounted()) {
      setLoading(false)
      if (res?.success) {
        const cats = categoriesDto(res?.categories || [])
        setCategories(cats)
        setCategoryId(cats?.[0]?.id)
      }
    }
  }, [isMounted, tournamentId])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleTabChange = (tabId: number) => {
    setCategoryId(tabId)
  }

  const handleBack = () => {
    push('/')
  }

  const categoryTabs = useMemo<ITab[]>(() => {
    return categories
      .map(({ id, title, gender, published }) => {
        const label = `${title} ${constGender?.[gender] || ''}`
        return published ? { label, value: id } : null
      })
      .filter(f => !!f)
      .sort(compareValues('label', 'asc'))
  }, [categories])

  if (loading) return <CircleLoading />

  const title = expired ? 'Rankings do torneio' : 'Duplas do torneio'

  return (
    <Content>
      <div style={{ padding: '16px 0' }}>
        <CardHeader
          title={tournament?.title}
          // subheader={tournament?.description}
          subheader={
            <MkContainer>
              <ReactMarkdown remarkPlugins={[gfm]}>{tournament?.description}</ReactMarkdown>
            </MkContainer>
          }
          action={
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          }
        />
        <Chip sx={{ marginLeft: 2 }} color="primary" variant="outlined" label={tournament?.arena?.title} />
      </div>

      <Divider />

      <CardHeader title={title} />
      <SimpleTab value={categoryId} sx={{ boxShadow: '1px 2px 1px #0003' }} onChange={handleTabChange} tabs={categoryTabs} />

      {!!categoryId && expired ? <RankingList tournamentId={tournamentId} categoryId={categoryId} /> : null}
      {!!categoryId && !expired ? <ListPartners categoryId={categoryId} /> : null}
    </Content>
  )
}
