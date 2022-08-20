import React from 'react'

import { Grid, Typography } from '@mui/material'

import { TournamentCard } from './TournamentCard'

// import { Container } from './styles';

export const SectionTournaments: React.FC = () => {
  return (
    <section>
      <Typography variant="h2" align="center" sx={{ m: 2 }}>
        Torneios
      </Typography>
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <TournamentCard image={'https://mui.com/static/images/cards/paella.jpg'} />
            </Grid>
            <Grid item>
              <TournamentCard image={'https://mui.com/static/images/cards/contemplative-reptile.jpg'} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </section>
  )
}
