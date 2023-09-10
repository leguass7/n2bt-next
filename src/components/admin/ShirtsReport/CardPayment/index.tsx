import React, { useCallback, useEffect, useState } from 'react'
import { Chart, type GoogleChartOptions } from 'react-google-charts'
import { toast } from 'react-toastify'

import { ContentCopy, Update } from '@mui/icons-material'
import { Card, CardContent, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { CircleLoading } from '~/components/CircleLoading'
import { formatPrice } from '~/helpers'
import { type Payment } from '~/server-side/useCases/payment/payment.entity'
import { reportPayments } from '~/services/api/payment'

type Statistics = {
  totalPaid: number
  totalNotPaid: number
  discounts: number
}
function reportPaymentDto(data: Payment[]): Statistics {
  const arr = []
  let totalPaid = 0
  let totalNotPaid = 0
  let discounts = 0

  data.forEach(({ value, id, paid, subscriptions }) => {
    const sub = subscriptions?.[0]
    const isPaid = Boolean(paid || sub?.paid)
    const realValue = Math.min(value || 0, sub?.value || 0, sub?.category?.price || 0)
    const supValue = Math.max(value || 0, sub?.value || 0, sub?.category?.price || 0)

    if (!arr.includes(id)) {
      arr.push(id)
      if (isPaid) {
        totalPaid += realValue
        discounts += supValue - realValue
      } else totalNotPaid += realValue
    }
  })

  return {
    totalPaid,
    totalNotPaid,
    discounts
  }
}

type Props = { tournamentId: number }
export const CardPayment: React.FC<Props> = ({ tournamentId }) => {
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<Statistics>({ totalPaid: 0, totalNotPaid: 0, discounts: 0 })
  const { theme } = useAppTheme()

  const options: Partial<GoogleChartOptions> = {
    backgroundColor: theme.colors.background,
    title: 'Pagamentos',
    legend: 'Pagamentos'
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

  const fetchPayments = useCallback(async () => {
    if (tournamentId) {
      setLoading(true)
      const response = await reportPayments(tournamentId)
      setLoading(false)
      if (response?.success) {
        setStatistics(reportPaymentDto(response?.payments || []))
      }
    }
  }, [tournamentId])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  // const paymentStatistics = useMemo(() => {
  //   if (!payments?.length) return null
  //   const paid = payments.filter(({ paid, actived }) => actived && paid).map(getPaymentValues)
  //   const notPaid = payments.filter(({ paid, actived }) => actived && !paid).map(getPaymentValues)
  //   const totalPaid = paid.reduce(sum, 0)
  //   const totalNotPaid = notPaid.reduce(sum, 0)
  //   return { totalPaid, totalNotPaid }
  // }, [payments])

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader
        title="Pagamentos"
        action={
          <>
            <IconButton onClick={fetchPayments}>
              <Update />
            </IconButton>
            <IconButton onClick={handleCopyPaymentInfo}>
              <ContentCopy />
            </IconButton>
          </>
        }
      />
      <Divider />

      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {statistics?.totalPaid || statistics?.totalNotPaid ? (
              <Chart
                chartType="PieChart"
                width="100%"
                legendToggle
                options={options}
                data={[
                  ['Pago', 'Não pago'],
                  ['Pago (R$)', statistics?.totalPaid || 0],
                  ['Não pago (R$)', statistics?.totalNotPaid || 0]
                ]}
              />
            ) : null}
          </Grid>
          <Grid item xs={12} id="payments-info">
            <Grid container height="100%" alignItems="flex-end">
              <Typography variant="caption" fontWeight={700}>
                Total recebido: {formatPrice(statistics?.totalPaid || 0)}
                <br />
                Total a receber: {formatPrice(statistics?.totalNotPaid || 0)}
                <br />
                Discontos nas inscrições: {formatPrice(statistics?.discounts || 0)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      {loading ? <CircleLoading /> : null}
    </Card>
  )
}
