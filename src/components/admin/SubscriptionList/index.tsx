import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { Divider, Stack } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import { CircleLoading } from '~/components/CircleLoading'
import { useOnceCall } from '~/hooks/useOnceCall'
import { listAdminSubscriptions } from '~/services/api/subscriptions'

import { ActionVerified } from './ActionVerified'
import { ItemSubscription } from './ItemSubscription_old'
import { PairTools } from './PairTools'
import { prepareDto, Pair } from './utils'

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
export const SubscriptionList: React.FC<Props> = ({ categoryId, tournamentId, onLoad }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Pair[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const response = await listAdminSubscriptions({ categoryId })
    if (response?.success) {
      const d = prepareDto(response?.subscriptions || [])
      setData(d)
      const params: OnLoadParams = {
        pairs: d.filter(f => !!f?.partnerSubscription)?.length || 0,
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
        const verified = !!(subscription?.userSubscription?.verified && subscription?.partnerSubscription?.verified)
        return (
          <React.Fragment key={subscription?.id}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card sx={{ minHeight: 150 }}>
                <CardContent sx={{ padding: 1 }}>
                  <ItemSubscription {...subscription?.userSubscription} updateListHandler={fetchData} />
                  {subscription?.partnerSubscription ? (
                    <ItemSubscription {...subscription?.partnerSubscription} updateListHandler={fetchData} />
                  ) : (
                    <PairTools
                      categoryId={categoryId}
                      tournamentId={tournamentId}
                      subscriptionId={subscription?.userSubscription?.id}
                      onSuccess={fetchData}
                    />
                  )}
                </CardContent>
                <Divider />
                <CardActions>
                  <Stack direction={'row'} spacing={1} sx={{ ml: 1 }}>
                    <ActionVerified
                      verified={verified}
                      partnerSubscriptionId={subscription?.partnerSubscription?.id}
                      userSubscriptionId={subscription?.userSubscription?.id}
                    />
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          </React.Fragment>
        )
      })}
      {loading ? <CircleLoading /> : null}
    </Grid>
  )
}
