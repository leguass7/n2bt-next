import React, { useCallback, useState } from 'react'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { useOnceCall } from '~/hooks/useOnceCall'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { listTournaments } from '~/services/api/tournament'

import { CircleLoading } from '../CircleLoading'
import { TournamentCard } from './TournamentCard'

type Props = {
  tournaments?: ITournament[]
}
export const SectionTournaments: React.FC<Props> = ({ tournaments = [] }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ITournament[]>(tournaments)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const response = await listTournaments({ size: 500, order: 'desc', orderby: 'createdAt' })
    setLoading(false)
    if (response.success) setData(response?.tournaments || [])
  }, [])

  useOnceCall(() => {
    fetchData()
  })

  if (!data.length) return null

  return (
    <section>
      <Typography variant="h5" align="center" sx={{ m: 2 }}>
        Torneios
      </Typography>
      <Grid sx={{ flexGrow: 1 }} container spacing={2} justifyContent="center">
        <Grid item sm={12} xs={12} md={12} lg={10} xl={8} justifyContent="center">
          <Grid container justifyContent="center" spacing={2}>
            {data?.map(tournament => {
              return (
                <Grid item key={`tournament-${tournament?.id}`} xs={12} sm={6} md={6} lg={4}>
                  <TournamentCard {...tournament} />
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
      {loading ? <CircleLoading relative /> : null}
    </section>
  )
}
