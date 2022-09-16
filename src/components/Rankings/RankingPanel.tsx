import { useCallback, useEffect, useMemo, useState } from 'react'

import { CardHeader, Chip, Divider } from '@mui/material'
import { isPast } from 'date-fns'

import { useIsMounted } from '~/hooks/useIsMounted'
import { ICategory } from '~/server-side/useCases/category/category.dto'
import { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { listCategories } from '~/services/api/category'
import { Content } from '~/styles'

import { CircleLoading } from '../CircleLoading'
import { ITab, SimpleTab } from '../Common/SimpleTab'
import { SubscriptionList } from '../SectionPairSubscriptions/SubscriptionList'
import { ListPartners } from '../User/ListPartners'
import { RankingList } from './RankingList'

interface Props {
  tournamentId: number
  tournament?: ITournament
}

export const RankingPanel: React.FC<Props> = ({ tournamentId, tournament = {} }) => {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [tab, setTab] = useState('')

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const expired = tournament?.expires && isPast(tournament?.expires)

  const fetchCategories = useCallback(async () => {
    if (!tournamentId) return
    setLoading(true)
    const { success, categories: cat } = await listCategories(tournamentId)
    if (isMounted()) {
      setLoading(false)
      if (success) {
        setCategories(cat)
        setTab(`${cat?.[0]?.id || ''}`)
      }
    }
  }, [isMounted, tournamentId])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const categoryTabs = useMemo<ITab[]>(() => {
    return categories?.map?.(({ id, title }) => {
      return { label: title, value: `${id}` }
    })
  }, [categories])

  if (loading) return <CircleLoading />
  const title = expired ? 'Rankings do torneio' : 'Pares do torneio'

  return (
    <Content>
      <div style={{ padding: '16px 0' }}>
        <CardHeader title={tournament?.title} subheader={tournament?.description} />
        <Chip sx={{ marginLeft: 2 }} color="primary" variant="outlined" label={tournament?.arena?.title} />
      </div>

      <Divider />

      <CardHeader title={title} />
      <SimpleTab value={tab || false} sx={{ boxShadow: '1px 2px 1px #0003' }} variant="fullWidth" onChange={v => setTab(v)} tabs={categoryTabs} />

      {!!tab && expired ? <RankingList tournamentId={tournamentId} tab={tab} /> : null}
      {!!tab && !expired ? <ListPartners categoryId={tab} /> : null}
    </Content>
  )
}
