import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import MaleIcon from '@mui/icons-material//Male'
import FemaleIcon from '@mui/icons-material/Female'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'

import { CircleLoading } from '~/components/CircleLoading'
import { Text } from '~/components/styled'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { CategoryGender } from '~/server-side/useCases/category/category.entity'
import { paginateSubscription } from '~/services/api/subscriptions'

import { ItemSubscription } from './ItemSubscription'
import { prepareDto, PreparedSubscription } from './utils'

type Props = {
  categoryId: number
  tournamentId: number
  onlyVerified?: boolean
  anyVerified?: boolean
  categoryName?: string
  categoryGender?: CategoryGender
}

export const SubscriptionList: React.FC<Props> = ({ categoryId, onlyVerified, categoryName, categoryGender, anyVerified }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PreparedSubscription[]>([])

  const fetchData = useCallback(async () => {
    const filter = (d: PreparedSubscription) => {
      if (onlyVerified) return !!!d.verified
      return true
    }
    setLoading(true)
    const response = await paginateSubscription(categoryId, { page: 1, size: 1000, order: 'asc', orderby: 'name', onlyConfirmed: !anyVerified })
    if (response?.success) {
      setData(prepareDto(response?.data?.filter(filter) || []))
    } else {
      toast.error(response?.message || 'Erro')
    }
    setLoading(false)
  }, [categoryId, onlyVerified, anyVerified])

  useOnceCall(fetchData)

  const genderIcon = {
    M: <MaleIcon />,
    F: <FemaleIcon />
  }
  return (
    <>
      <Grid container spacing={1} sx={{ mt: 1, mb: 2 }}>
        {data?.map(subscription => {
          return (
            <React.Fragment key={subscription?.key}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                <Card sx={{ minHeight: 150 }}>
                  {categoryName ? (
                    <>
                      <CardHeader
                        subheader={categoryName}
                        action={
                          <IconButton size="small" disabled>
                            {genderIcon[categoryGender]}
                          </IconButton>
                        }
                      />
                      <Divider />
                    </>
                  ) : null}

                  <CardContent sx={{ padding: 1 }}>
                    <ItemSubscription {...subscription} updateListHandler={fetchData} />
                    {subscription?.pair ? <ItemSubscription {...subscription?.pair} updateListHandler={fetchData} /> : null}
                  </CardContent>
                </Card>
              </Grid>
            </React.Fragment>
          )
        })}
        {!data.length && !loading ? (
          <Alert variant="outlined" severity="info">
            <AlertTitle>Duplas confirmadas</AlertTitle>
            Não há confirmação de duplas cadastradas.{' '}
            <Text textSize={14} textStyle="italic">
              (Apenas duplas confirmadas pela administração do torneio)
            </Text>
          </Alert>
        ) : null}
        {loading ? <CircleLoading /> : null}
      </Grid>
    </>
  )
}
