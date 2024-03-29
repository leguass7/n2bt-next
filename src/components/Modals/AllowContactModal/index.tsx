import { useCallback, useEffect, useState } from 'react'

import { Button, Grid } from '@mui/material'

import { SimpleModal } from '~/components/Common/SimpleModal'
import { wait } from '~/helpers'
import { useAppAuth } from '~/hooks/useAppAuth'
import { useIsMounted } from '~/hooks/useIsMounted'
import { useOnceCall } from '~/hooks/useOnceCall'
import { type IUser } from '~/server-side/useCases/user/user.dto'
import { updateUser } from '~/services/api/user'

interface Props {
  delayInSeconds?: number
}

export const AllowContactModal: React.FC<Props> = ({ delayInSeconds = 60 }) => {
  const { requestMe, updateAppAuth } = useAppAuth()
  const [hide, setHide] = useState(false)

  const [data, setData] = useState<IUser>({})
  const isMounted = useIsMounted()

  const getMe = useCallback(async () => {
    const { success, user = {} } = await requestMe()
    if (isMounted() && success) setData(user)
  }, [isMounted, requestMe])

  useOnceCall(getMe)

  const handleClick = (allow: boolean) => async () => {
    const id = data?.id
    if (!id) return

    await updateUser(id, { allowedContact: !!allow }).then(({ success }) => {
      if (success) updateAppAuth({ allowedContact: !!allow })
      getMe()
    })
  }

  const handleRenderDelay = useCallback(async () => {
    setHide(true)

    wait(delayInSeconds * 1000).then(() => {
      setHide(false)
    })
  }, [delayInSeconds])

  useEffect(() => {
    handleRenderDelay()
  }, [handleRenderDelay])

  return !hide ? (
    <SimpleModal open={data?.allowedContact === null} onToggle={handleClick(false)} title="Deseja ser notificado quando houver outro torneio?">
      <Grid container justifyContent="center" pt={2} alignItems="center">
        <Button onClick={handleClick(false)} variant="outlined" sx={{ mr: 2 }}>
          Não
        </Button>

        <Button onClick={handleClick(true)} variant="contained">
          Sim
        </Button>
      </Grid>
    </SimpleModal>
  ) : null
}
