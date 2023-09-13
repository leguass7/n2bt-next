import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { ArrowBack } from '@mui/icons-material'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import Link from 'next/link'

import { TableReport } from '~/components/admin/TableReport'
import { CircleLoading } from '~/components/CircleLoading'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ISubscription, ISubscriptionStatistics } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { getSubscriptionReport } from '~/services/api/subscriptions'

import { CardPayment } from './CardPayment'
import { CardShirtStats } from './CardShirtStats'

type Props = {
  tournamentId: number
}

export const ShirtsReport: React.FC<Props> = ({ tournamentId }) => {
  const [data, setData] = useState<ISubscription[]>([])
  const [stats, setStats] = useState<ISubscriptionStatistics>()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(
    async (filter?: Record<string, any>) => {
      if (tournamentId) {
        setLoading(true)
        const { success, subscriptions = [], message, statistics } = await getSubscriptionReport(tournamentId, filter)
        setLoading(false)
        if (success) {
          setData(subscriptions)
          setStats(statistics)
        } else toast.error(message)
      }
      if (!tournamentId) return
    },
    [tournamentId]
  )

  useOnceCall(fetchData)

  return (
    <>
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

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <CardShirtStats tournamentId={tournamentId} statistics={stats} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <CardPayment tournamentId={tournamentId} />
        </Grid>
      </Grid>

      <Grid pt={5} container>
        <Card>
          <CardContent>
            <TableReport data={data} fetchData={fetchData} />
          </CardContent>
        </Card>
      </Grid>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
