import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'

import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { differenceInMinutes } from 'date-fns'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import gfm from 'remark-gfm'

import { Layout } from '~/components/app/Layout'
import { CircleLoading } from '~/components/CircleLoading'
import { SectionPairSubscriptions } from '~/components/SectionPairSubscriptions'
import { FlexContainer, MkContainer } from '~/components/styled'
import { useOnceCall } from '~/hooks/useOnceCall'
import { prepareConnection } from '~/server-side/database/conn'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { Tournament } from '~/server-side/useCases/tournament/tournament.entity'
import { listCategories } from '~/services/api/category'

interface PageProps {
  tournamentId?: number
  csrfToken?: string
  uaString?: string
  isExpired?: boolean
  tournament?: Partial<ITournament>
}

const TournamentAboutPage: NextPage<PageProps> = ({ tournamentId, tournament }) => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])

  const fetchData = useCallback(async () => {
    if (tournamentId) {
      setLoading(true)
      const response = await listCategories(tournamentId)
      if (response?.success && response?.categories?.length) {
        setCategories(response.categories.filter(f => !!f?.published))
      } else {
        toast.error('Nenhuma categoria para torneio')
      }
      setLoading(false)
    }
  }, [tournamentId])

  useOnceCall(fetchData)

  return (
    <Layout>
      <Head>
        <title>Inscrições {tournament?.title} - N2BT Beach Tennis</title>
        <meta name="description" content={`Inscrições realizadas no ${tournament?.title}. Beach Tennis, Aulas, Torneios e muito mais`} />
      </Head>
      <Typography variant="h2" align="center" sx={{ m: 2 }}>
        Inscrições {tournament?.title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <FlexContainer justify="center">
        <MkContainer>
          <ReactMarkdown remarkPlugins={[gfm]}>{tournament?.description}</ReactMarkdown>
        </MkContainer>
      </FlexContainer>
      <Divider sx={{ mb: 2, mt: 2 }} />
      {categories?.length ? <SectionPairSubscriptions categories={categories} /> : <Alert>Nenhuma categoria</Alert>}
      {loading ? <CircleLoading /> : null}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, params }) => {
  const tournamentId = +params?.tournamentId || 0

  const ds = await prepareConnection()
  const repo = ds.getRepository(Tournament)
  const tournament = await repo.findOne({ where: { id: tournamentId } })
  const isExpired = !!(tournament?.subscriptionExpiration && differenceInMinutes(tournament?.subscriptionExpiration, new Date()) <= 0)

  return {
    props: {
      tournamentId,
      uaString: req.headers['user-agent'],
      isExpired,
      tournament: { title: tournament?.title, description: tournament?.description, maxSubscription: tournament?.maxSubscription }
    }
  }
}

export default TournamentAboutPage
