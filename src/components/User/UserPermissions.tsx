import { useCallback, useRef, useState } from 'react'

import { Button, Divider, Grid } from '@mui/material'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'

import { useAppAuth } from '~/hooks/useAppAuth'
import { useIsMounted } from '~/hooks/useIsMounted'
import { useOnceCall } from '~/hooks/useOnceCall'
import { IUser } from '~/server-side/useCases/user/user.dto'
import { getMe } from '~/services/api/me'
import { updateUser } from '~/services/api/user'

import { CircleLoading } from '../CircleLoading'
import { Switch } from '../forms/UnForm/Switch'

interface Props {}

interface PermissionsFormData {
  allowedContact: boolean
}

export const UserPermissions: React.FC<Props> = () => {
  const { updateAppAuth } = useAppAuth()
  const formRef = useRef<FormHandles>(null)

  const isMounted = useIsMounted()
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<IUser>({})

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { success = false, user = {} } = await getMe()
    if (isMounted() && success) {
      setLoading(false)
      setData(user)

      formRef.current?.setData?.({ allowedContact: !!user?.allowedContact })
    }
  }, [isMounted])

  useOnceCall(fetchData)

  const handleSubmit = useCallback(
    async (formData: PermissionsFormData) => {
      const id = data?.id
      if (!id) return
      setLoading(true)

      const allowedContact = !!formData?.allowedContact

      const { success } = await updateUser(id, { allowedContact })

      if (isMounted()) {
        setLoading(false)

        if (success) updateAppAuth({ allowedContact })

        fetchData()
      }
    },
    [fetchData, data, isMounted, updateAppAuth]
  )

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12}>
          <Switch name="allowedContact" label="Deseja ser notificado quando houver outro torneio?" />
        </Grid>
        <Grid item xs={12}>
          <br />
          <Divider />
          <br />
          <Grid container justifyContent="center">
            <Button variant="contained" type="submit">
              Salvar
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {loading ? <CircleLoading /> : null}
    </Form>
  )
}
