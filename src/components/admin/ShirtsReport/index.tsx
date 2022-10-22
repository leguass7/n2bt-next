import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { ArrowBack, ContentCopy } from '@mui/icons-material'
import { Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material'
import Link from 'next/link'

import { TableReport } from '~/components/admin/TableReport'
import { CircleLoading } from '~/components/CircleLoading'
import { useIsMounted } from '~/hooks/useIsMounted'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ISubscription, ISubscriptionStatistics } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { getSubscriptionReport } from '~/services/api/subscriptions'

type Props = {
  tournamentId: number
}
export const ShirtsReport: React.FC<Props> = ({ tournamentId }) => {
  const [data, setData] = useState<ISubscription[]>([])
  const [statistics, setStatistics] = useState<Partial<ISubscriptionStatistics>>({})

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const fetchData = useCallback(
    async (filter?: Record<string, any>) => {
      if (!tournamentId) return
      setLoading(true)

      const { success, subscriptions = [], message, statistics } = await getSubscriptionReport(tournamentId, filter)

      if (isMounted()) {
        setLoading(false)
        if (!success) toast.error(message)
        else {
          setData(subscriptions)
          setStatistics(statistics)
        }
      }
    },
    [tournamentId, isMounted]
  )

  useOnceCall(fetchData)

  const renderShirtStatistics = useCallback(() => {
    if (!statistics?.sizes) return null
    const sizes = Object.entries(statistics.sizes)

    return sizes.map(([key, value]) => {
      return (
        <Typography key={key}>
          <b>{key}:</b> {value}
        </Typography>
      )
    })
  }, [statistics])

  const handleCopyShirtInfo = () => {
    if (document) {
      const containerInfo = document.getElementById('shirts-quantity')
      const info = containerInfo?.innerText?.replace(/\n\n/g, '\n')
      if (info) {
        navigator.clipboard.writeText(info)
        toast('Conteúdo copiado com sucesso!', { type: 'info', position: 'bottom-right' })
      }
    }
  }

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

      <Grid container>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card>
            <CardHeader
              title="Qtd de camisetas"
              action={
                <IconButton onClick={handleCopyShirtInfo}>
                  <ContentCopy />
                </IconButton>
              }
            />
            <Divider />

            <CardContent id="shirts-quantity">{renderShirtStatistics()}</CardContent>
            <CardActions>
              <Typography variant="body1" fontWeight={700} align="right">
                Total: {statistics?.total}
              </Typography>
            </CardActions>
          </Card>
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
