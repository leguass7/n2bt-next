import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Chart, type GoogleChartOptions } from 'react-google-charts'
import { toast } from 'react-toastify'

import { ContentCopy } from '@mui/icons-material'
import { Card, CardContent, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { CircleLoading } from '~/components/CircleLoading'
import { formatPrice } from '~/helpers'
import { type Payment } from '~/server-side/useCases/payment/payment.entity'
import { reportPayments } from '~/services/api/payment'

const getPaymentValues = (payment: Payment) => payment?.value || 0
const sum = (prev: number, next: number): number => prev + next

type Props = { tournamentId: number }

export const CardPayment: React.FC<Props> = ({ tournamentId }) => {
  const [loading, setLoading] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
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
      if (response?.success) setPayments(response?.payments || [])
    }
  }, [tournamentId])

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

  return (
    <Card sx={{ position: 'relative' }}>
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
      {loading ? <CircleLoading /> : null}
    </Card>
  )
}
