import React, { useCallback, useState } from 'react'

import { Grid, Typography } from '@mui/material'

import { useOnceCall } from '~/hooks/useOnceCall'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { listTournaments } from '~/services/api/tournament'

import { TournamentCard } from './TournamentCard'

// import { Container } from './styles';

export const SectionTournaments: React.FC = () => {
  const [data, setData] = useState<ITournament[]>([])

  const fetchData = useCallback(async () => {
    const response = await listTournaments({ size: 500, order: 'desc', orderby: 'createdAt' })
    if (response.success) setData(response?.tournaments || [])
  }, [])

  useOnceCall(() => {
    fetchData()
  })

  if (!data.length) return null

  return (
    <section>
      <Typography variant="h2" align="center" sx={{ m: 2 }}>
        Torneios
      </Typography>
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {data?.map(tournament => {
              return (
                <Grid item key={`tournament-${tournament?.id}`}>
                  <TournamentCard {...tournament} />
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    </section>
  )
}
