import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Chart, GoogleChartOptions } from 'react-google-charts'
import { toast } from 'react-toastify'

import { ArrowBack, ContentCopy } from '@mui/icons-material'
import { Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material'
import Link from 'next/link'

import { TableReport } from '~/components/admin/TableReport'
import { themes } from '~/components/AppThemeProvider/themes'
import { CircleLoading } from '~/components/CircleLoading'
import { formatPrice } from '~/helpers'
import { useIsMounted } from '~/hooks/useIsMounted'
import { useOnceCall } from '~/hooks/useOnceCall'
import { Payment } from '~/server-side/useCases/payment/payment.entity'
import type { ISubscription, ISubscriptionStatistics } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { searchPayments } from '~/services/api/payment'
import { getSubscriptionReport } from '~/services/api/subscriptions'

const options: Partial<GoogleChartOptions> = {
  backgroundColor: themes.common.colors.background,
  title: 'Pagamentos',
  legend: 'Pagamentos'
}

const getPaymentValues = (payment: Payment) => payment?.value || 0
const sum = (prev: number, next: number): number => prev + next

type Props = {
  tournamentId: number
}

export const ShirtsReport: React.FC<Props> = ({ tournamentId }) => {
  const [data, setData] = useState<ISubscription[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [statistics, setStatistics] = useState<Partial<ISubscriptionStatistics>>({})

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const fetchPayments = useCallback(async () => {
    if (!tournamentId) return

    setLoading(true)
    const response = await searchPayments({ tournamentId })

    if (isMounted()) {
      setLoading(false)
      if (response?.payments?.length) setPayments(response?.payments)
    }
  }, [isMounted, tournamentId])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const paymentStatistics = useMemo(() => {
    if (!payments?.length) return null

    const paid = payments.filter(({ paid, actived }) => actived && paid).map(getPaymentValues)
    const notPaid = payments.filter(({ paid, actived }) => actived && !paid).map(getPaymentValues)

    const totalPaid = paid.reduce(sum, 0)
    const totalNotPaid = notPaid.reduce(sum, 0)

    return { totalPaid, totalNotPaid }
  }, [payments])

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

  const handleCopyPaymentInfo = () => {
    if (document) {
      const containerInfo = document.getElementById('payments-info')
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

      <Grid container spacing={2}>
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
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card>
            <CardHeader
              title="Pagamentos"
              action={
                <IconButton onClick={handleCopyPaymentInfo}>
                  <ContentCopy />
                </IconButton>
              }
            />
            <Divider />

            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {paymentStatistics?.totalPaid || paymentStatistics?.totalNotPaid ? (
                    <Chart
                      chartType="PieChart"
                      width="100%"
                      legendToggle
                      options={options}
                      data={[
                        ['Pago', 'Não pago'],
                        ['Pago (R$)', paymentStatistics?.totalPaid || 0],
                        ['Não pago (R$)', paymentStatistics?.totalNotPaid || 0]
                      ]}
                    />
                  ) : null}
                </Grid>
                <Grid item xs={12} id="payments-info">
                  <Grid container height="100%" alignItems="flex-end">
                    <Typography variant="caption" fontWeight={700}>
                      Total recebido: {formatPrice(paymentStatistics?.totalPaid || 0)}
                      <br />
                      Total a receber: {formatPrice(paymentStatistics?.totalNotPaid || 0)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
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
