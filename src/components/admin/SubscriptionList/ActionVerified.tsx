import React, { useState } from 'react'
import { toast } from 'react-toastify'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'

import { Text } from '~/components/styled'
import { updateSubscription } from '~/services/api/subscriptions'

type Props = {
  verified?: boolean
  partnerSubscriptionId: number
  userSubscriptionId: number
}
export const ActionVerified: React.FC<Props> = ({ verified, partnerSubscriptionId, userSubscriptionId }) => {
  const [checked, setChecked] = useState(!!verified)

  const fetchData = async (chk?: boolean) => {
    const verified = chk ? new Date() : null
    updateSubscription(partnerSubscriptionId, { verified }).then(async res1 => {
      if (!res1.success) toast.error(res1?.message || 'Erro ao atualizar inscrição do parceiro')
      else {
        const res2 = await updateSubscription(userSubscriptionId, { verified })
        if (!res2.success) toast.error(res2?.message || 'Erro ao atualizar inscrição do parceiro')
      }
      return
    })
  }

  const onChange = (e, chk?: boolean) => {
    setChecked(!!chk)
    fetchData(chk)
  }

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch size="small" checked={checked} onChange={onChange} />}
        label={<Text textSize={12}>{checked ? 'confirmado' : 'não confirmado'}</Text>}
      />
    </FormGroup>
  )
}
