import { useCallback, useEffect, useState } from 'react'

import { List } from '@mui/material'

import { CircleLoading } from '~/components/CircleLoading'
import { useIsMounted } from '~/hooks/useIsMounted'
import { PlayField } from '~/server-side/useCases/play-field/play-field.entity'
import { listPlayFieldInArena } from '~/services/api/play-field'

import { PlayFieldSelectItem } from './PlayFieldSelectItem'

interface Props {
  arenaId?: number
}

export const PlayFieldWithAppointments: React.FC<Props> = ({ arenaId }) => {
  const [fields, setFields] = useState<PlayField[]>([])
  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const fetchData = useCallback(async () => {
    if (!arenaId) return null
    setLoading(true)

    const response = await listPlayFieldInArena(arenaId, { actived: true })
    if (isMounted()) {
      setLoading(false)
      setFields(response?.data)
    }
  }, [isMounted, arenaId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <List>
        {fields?.length
          ? fields.map(field => {
              return <PlayFieldSelectItem key={`field-${field.id}`} {...field} />
            })
          : null}
      </List>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
