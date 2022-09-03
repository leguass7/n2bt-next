import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { Card, CardContent, Grid } from '@mui/material'

import { CircleLoading } from '~/components/CircleLoading'
import { useOnceCall } from '~/hooks/useOnceCall'
import { listAdminSubscriptions } from '~/services/api/subscriptions'

import { ItemSubscription } from './ItemSubscription'
import { prepareDto, PreparedSubscription } from './utils'

// import { Container } from './styles';
type Props = {
  categoryId: number
  tournamentId: number
}
export const SubscriptionList: React.FC<Props> = ({ categoryId }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PreparedSubscription[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const response = await listAdminSubscriptions({ categoryId })
    if (response?.success) {
      setData(prepareDto(response?.subscriptions || []))
    } else {
      toast.error(response?.message || 'Erro')
    }
    setLoading(false)
  }, [categoryId])

  useOnceCall(fetchData)

  return (
    <Grid container spacing={1} sx={{ mt: 1 }}>
      {data?.map(subscription => {
        return (
          <React.Fragment key={subscription?.key}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card sx={{ minHeight: 150 }}>
                <CardContent sx={{ padding: 1 }}>
                  <ItemSubscription {...subscription} updateListHandler={fetchData} />
                  {subscription?.pair ? <ItemSubscription {...subscription?.pair} updateListHandler={fetchData} /> : null}
                </CardContent>
              </Card>
            </Grid>
          </React.Fragment>
        )
      })}
      {loading ? <CircleLoading /> : null}
    </Grid>
  )
}
