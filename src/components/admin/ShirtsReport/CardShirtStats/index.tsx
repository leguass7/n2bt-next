import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

import { ContentCopy } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, CardHeader, Divider, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'

import { CircleLoading } from '~/components/CircleLoading'
import type { ISubscriptionStatistics } from '~/server-side/useCases/subscriptions/subscriptions.dto'

type Props = {
  tournamentId: number
  statistics: Partial<ISubscriptionStatistics>
  loading?: boolean
}

export const CardShirtStats: React.FC<Props> = ({ tournamentId, statistics = {}, loading }) => {
  const { prefetch, push } = useRouter()

  useEffect(() => {
    prefetch(`/admin/tournaments/print-report?tournamentId=${tournamentId}`)
  }, [tournamentId, prefetch])

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

  const handleClickPrint = () => {
    push(`/admin/tournaments/print-report?tournamentId=${tournamentId}`)
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader
        title="Qtd de camisetas 1"
        action={
          <IconButton onClick={handleCopyShirtInfo}>
            <ContentCopy />
          </IconButton>
        }
      />
      <Divider />
      <CardContent id="shirts-quantity">
        <>
          {Object.entries(statistics?.sizes || {}).map(([key, value]) => {
            return (
              <Typography key={key}>
                <b>{key}:</b> {value}
              </Typography>
            )
          })}
        </>
      </CardContent>
      <CardActions sx={{ gap: 1, justifyContent: 'space-between' }}>
        <Typography variant="body1" fontWeight={700} align="right">
          Total: {statistics?.total || 0}
        </Typography>
        <Button variant="contained" onClick={handleClickPrint}>
          IMPRIMIR
        </Button>
      </CardActions>
      {loading ? <CircleLoading /> : null}
    </Card>
  )
}
