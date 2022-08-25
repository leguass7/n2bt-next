import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Button } from '@mui/material'

import { CircleLoading } from '~/components/CircleLoading'
import { useUserAuth } from '~/components/UserProvider'
import { useIsMounted } from '~/hooks/useIsMounted'
import { IUser } from '~/server-side/useCases/user/user.dto'
import { paginateUsers } from '~/services/api/user'

import { BoxCenter } from '../../styled'
import { PartnerItem } from './PartnerItem'

interface Props {}

export const SelectPatner: React.FC<Props> = () => {
  const { userData } = useUserAuth()
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(false)

  const isMounted = useIsMounted()

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { success, message, data } = await paginateUsers({ size: 12 })

    if (isMounted()) {
      setLoading(false)
      if (!success) {
        toast.error(message)
        return
      }

      setUsers(data)
    }
  }, [isMounted])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <BoxCenter>
      {users?.length
        ? users.map(user => {
            const { id, actived, category } = user
            const allowed = actived && category === userData.category

            if (!allowed) return null

            return <PartnerItem key={`user-${id}`} {...user} />
          })
        : null}
      <BoxCenter>
        <Button variant="contained" color="primary">
          Enviar
        </Button>
      </BoxCenter>

      {loading ? <CircleLoading /> : null}
    </BoxCenter>
  )
}
