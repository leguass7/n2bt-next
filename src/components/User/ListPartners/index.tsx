import { useCallback, useEffect, useState } from 'react'

import { List } from '@mui/material'

import { CircleLoading } from '~/components/CircleLoading'
import { useIsMounted } from '~/hooks/useIsMounted'

interface Props {}

export const ListPartners: React.FC<Props> = () => {
  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const fetchData = useCallback(async () => {
    setLoading(true)
    if (isMounted()) {
      setLoading(false)
    }
  }, [isMounted])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <CircleLoading />

  return (
    <>
      <List></List>
    </>
  )
}
