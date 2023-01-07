import { useCallback, useEffect, useState } from 'react'

import { Grid } from '@mui/material'

import { CircleLoading } from '~/components/CircleLoading'
import { useIsMounted } from '~/hooks/useIsMounted'
import type { PlayField } from '~/server-side/useCases/play-field/play-field.entity'
import { listPlayFieldInArena } from '~/services/api/play-field'
import { Content } from '~/styles'

import { PlayFieldItem } from './PlayFieldItem'

interface Props {
  children?: React.ReactNode
  arenaId: number
}

export const PlayFieldList: React.FC<Props> = ({ arenaId }) => {
  const [fields, setFields] = useState<PlayField[]>([])

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const fetchData = useCallback(async () => {
    if (!arenaId) return null
    setLoading(true)

    const { data = [] } = await listPlayFieldInArena(arenaId)

    if (isMounted()) {
      setLoading(false)
      if (data?.length) setFields(data.concat(data).concat(data).concat(data).concat(data).concat(data).concat(data))
    }
  }, [isMounted, arenaId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Content>
      <Grid container py={4} spacing={3}>
        {fields?.length
          ? fields.map(({ id, ...rest }) => {
              return (
                <>
                  <Grid item py={2} xs={12} sm={6} md={4} key={`field-${id}`}>
                    <PlayFieldItem id={id} {...rest} />
                  </Grid>
                </>
              )
            })
          : null}
      </Grid>
      {loading ? <CircleLoading /> : null}
    </Content>
  )
}
