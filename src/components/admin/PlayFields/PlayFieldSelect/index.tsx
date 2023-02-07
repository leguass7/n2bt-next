import { useCallback, useEffect, useState } from 'react'

import { List, ListItem } from '@mui/material'

import { CircleLoading } from '~/components/CircleLoading'
import { useIsMounted } from '~/hooks/useIsMounted'
import { PlayField } from '~/server-side/useCases/play-field/play-field.entity'
import { listPlayFieldInArena } from '~/services/api/play-field'

import { PlayFieldSelectItem } from './PlayFieldSelectItem'

interface Props {
  onSelect?: (id: number) => void
  arenaId?: number
}

export const PlayFieldSelect: React.FC<Props> = ({ arenaId, onSelect }) => {
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
              return <PlayFieldSelectItem onSelect={onSelect} key={`field-${field.id}`} {...field} />
            })
          : null}
      </List>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
