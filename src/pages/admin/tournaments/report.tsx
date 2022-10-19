import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { ArrowBack } from '@mui/icons-material'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { TableReport } from '~/components/admin/TableReport'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { CircleLoading } from '~/components/CircleLoading'
import { useIsMounted } from '~/hooks/useIsMounted'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { getSubscriptionReport } from '~/services/api/subscriptions'

interface Props {
  tournamentId?: number
  subscriptions?: ISubscription[]
}

const AdminTournamentReport: NextPage<Props> = ({ tournamentId }) => {
  const [data, setData] = useState<ISubscription[]>([])

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const fetchData = useCallback(
    async (filter?: Record<string, any>) => {
      if (!tournamentId) return
      setLoading(true)

      const { success, subscriptions = [], message } = await getSubscriptionReport(tournamentId, filter)

      if (isMounted()) {
        setLoading(false)

        success ? setData(subscriptions) : toast(message, { type: 'error' })
      }
    },
    [tournamentId, isMounted]
  )

  useOnceCall(fetchData)

  return (
    <LayoutAdmin>
      <Grid container py={2} justifyContent="space-between">
        <Link href="/admin/tournaments">
          <a>
            <ArrowBack fontSize="large" htmlColor="#fff" />
          </a>
        </Link>

        <Typography variant="h4" align="center">
          Relatório
        </Typography>

        <span />
      </Grid>

      {/* <Grid container>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card>
            <CardHeader title="Quantidade de camisetas" />
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <Typography align="center">Em espera: {counter?.WAITING}</Typography>
                  <Typography align="center">Em produção: {counter?.PRODUCTION}</Typography>
                  <Typography align="center">Enviadas: {counter?.SENT}</Typography>
                  <Typography align="center">Entregues: {counter?.DELIVERED}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      <Grid pt={5} container>
        <Card>
          <CardContent>
            <TableReport data={data} fetchData={fetchData} />
          </CardContent>
        </Card>
      </Grid>

      {loading ? <CircleLoading /> : null}
    </LayoutAdmin>
  )
}

export default AdminTournamentReport

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const tournamentId = +query?.tournamentId

  return {
    props: { tournamentId }
  }
}
