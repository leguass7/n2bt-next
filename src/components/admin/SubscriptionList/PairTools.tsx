import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import { SearchUserDrawer, SearchFetchHandler, SelectHandler } from '~/components/SearchUserDrawer'
import { searchAdminSubscriptionUsers, updateSubscription } from '~/services/api/subscriptions'

type Props = {
  subscriptionId: number
  categoryId: number
  tournamentId: number
  onSuccess?: (...n: any[]) => any
}
export const PairTools: React.FC<Props> = ({ categoryId, tournamentId, subscriptionId, onSuccess }) => {
  const [open, setOpen] = useState(false)
  const toogleClose = () => {
    setOpen(old => !old)
  }

  const fetcher: SearchFetchHandler = async data => {
    const response = await searchAdminSubscriptionUsers(data)
    return response
  }

  const handleSelect: SelectHandler = useCallback(
    async userId => {
      if (userId) {
        const response = await updateSubscription(subscriptionId, { partnerId: userId })
        if (response?.success) {
          toast.success('Parceiro atribuído com sucesso')
          if (onSuccess) onSuccess()
        } else toast.error(response?.message || 'Erro ao atribuir parceiro')
      }
    },
    [subscriptionId, onSuccess]
  )

  return (
    <>
      <Stack direction={'row'} spacing={1}>
        <Button size="small" onClick={toogleClose}>
          Adicionar
        </Button>
      </Stack>
      <SearchUserDrawer open={!!open} fetcher={fetcher} onClose={toogleClose} fixedFilter={{ categoryId, tournamentId }} onSelect={handleSelect} />
    </>
  )
}
