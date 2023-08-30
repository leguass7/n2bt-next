import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import AddIcon from '@mui/icons-material/Add'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Fab from '@mui/material/Fab'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import { CircleLoading } from '~/components/CircleLoading'
import { BoxCenter } from '~/components/styled'
import { useOnceCall } from '~/hooks/useOnceCall'
import { listAdminSubscriptions } from '~/services/api/subscriptions'

import { FormPairRanking, type SuccessHandler } from '../FormPairRanking'
import { ActionVerified } from './ActionVerified'
import { AddItem } from './AddItem'
import { ItemSubscription } from './ItemSubscription_old'
import { PairTools } from './PairTools'
import { prepareDto, type Pair } from './utils'

export type OnLoadParams = {
  pairs?: number
  users?: number
}

export type OnLoadHanlder = (params: OnLoadParams) => void

export type Edited = {
  userIds: string[]
  points?: number
}
type Props = {
  categoryName?: string
  categoryId: number
  tournamentId: number
  onLoad?: OnLoadHanlder
}
export const SubscriptionList: React.FC<Props> = ({ categoryName, categoryId, tournamentId, onLoad }) => {
  const [adding, setAdding] = useState(false)
  const [open, setOpen] = useState<string[]>([])
  const [edited, setEdited] = useState<Edited[]>([])
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

  const handleClose = useCallback(() => {
    setOpen([])
  }, [])

  const handleEditRanking = useCallback((userIds: string[] = []) => {
    return () => {
      setOpen(userIds.filter(f => !!f))
    }
  }, [])

  const handleEditRankingSuccess: SuccessHandler = useCallback(
    (userIds, points) => {
      setEdited(old => [...old, { userIds, points }])
      handleClose()
    },
    [handleClose]
  )

  const tootgleAdding = () => {
    setAdding(old => !old)
  }

  const onAddSuccess = () => {
    tootgleAdding()
    fetchData()
  }

  return (
    <Grid container spacing={1} sx={{ mt: 1 }}>
      {adding ? <AddItem categoryId={categoryId} tournamentId={tournamentId} onSuccess={onAddSuccess} /> : null}
      {data?.map(subscription => {
        const verified = !!(subscription?.userSubscription?.verified && subscription?.partnerSubscription?.verified)
        const hasEdit = edited.find(f => f.userIds.includes(subscription?.userId) || f.userIds.includes(subscription?.partnerId))
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
                <Divider sx={{ fontSize: 10, mt: 0, mb: 0 }}>{categoryName}</Divider>
                <CardActions>
                  <Stack direction={'row'} justifyContent="space-between" spacing={1} sx={{ ml: 1, width: '100%' }}>
                    <ActionVerified
                      verified={verified}
                      partnerSubscriptionId={subscription?.partnerSubscription?.id}
                      userSubscriptionId={subscription?.userSubscription?.id}
                    />
                    <div style={{ flex: 1 }} />
                    <IconButton size="small" onClick={handleEditRanking([subscription?.userId, subscription?.partnerId])}>
                      <Tooltip title={`Editar ranking ${hasEdit?.points || ''}`}>
                        <MilitaryTechIcon fontSize="small" color={hasEdit ? 'primary' : 'inherit'} />
                      </Tooltip>
                    </IconButton>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          </React.Fragment>
        )
      })}
      {loading ? <CircleLoading /> : null}
      <Modal open={!!open?.length} onClose={handleClose} keepMounted={false}>
        <BoxCenter spacing={1}>
          <Card sx={{ maxWidth: '100%', width: 500 }}>
            <CardHeader title={`Editar Ranking`} />
            <Divider />
            <CardContent>
              <FormPairRanking categoryId={categoryId} userIds={open} onSuccess={handleEditRankingSuccess} onCancel={handleClose} />
            </CardContent>
          </Card>
        </BoxCenter>
      </Modal>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 20, right: 20 }} onClick={tootgleAdding} title="Adicionar inscrição">
        <Tooltip title="Adicionar inscrição manualmente" arrow placement="left-start">
          <AddIcon />
        </Tooltip>
      </Fab>
    </Grid>
  )
}
