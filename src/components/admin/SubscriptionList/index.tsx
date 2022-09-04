import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { Card, CardContent, Grid } from '@mui/material'

import { CircleLoading } from '~/components/CircleLoading'
import { useOnceCall } from '~/hooks/useOnceCall'
import { listAdminSubscriptions } from '~/services/api/subscriptions'

import { ItemSubscription } from './ItemSubscription'
import { prepareDto, PreparedSubscription } from './utils'

// import { Container } from './styles';
export type OnLoadParams = {
  pairs?: number
  users?: number
}

export type OnLoadHanlder = (params: OnLoadParams) => void
type Props = {
  categoryId: number
  tournamentId: number
  onLoad?: OnLoadHanlder
}
export const SubscriptionList: React.FC<Props> = ({ categoryId, onLoad }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PreparedSubscription[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const response = await listAdminSubscriptions({ categoryId })
    if (response?.success) {
      const d = prepareDto(response?.subscriptions || [])
      setData(d)
      const params: OnLoadParams = {
        pairs: d.filter(f => !!f?.pair)?.length || 0,
        users: d?.length || 0
      }
      if (onLoad) onLoad(params)
    } else {
      toast.error(response?.message || 'Erro')
    }

    setLoading(false)
  }, [categoryId, onLoad])

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
