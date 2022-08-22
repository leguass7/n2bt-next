import React from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { differenceInDays, parseJSON } from 'date-fns'
import { useRouter } from 'next/router'

import img02 from '~/assets/paella.jpg'
import img01 from '~/assets/reptile.jpg'
import { ITournament } from '~/server-side/useCases/tournament/tournament.dto'

const images = [
  { id: 1, image: img01 },
  { id: 2, image: img02 }
  //
]

const getImage = (id: number) => {
  return images.find(f => f.id === id)?.image?.src || img01?.src
}

type Props = Partial<ITournament> & {}

export const TournamentCard: React.FC<Props> = ({ id, title, description, expires }) => {
  const { push } = useRouter()
  const expiresDate = (typeof expires === 'string' ? parseJSON(expires) : expires) as Date
  const expired = differenceInDays(new Date(), expiresDate)

  return (
    <Card sx={{ maxWidth: '100%', minWidth: 320 }}>
      <CardMedia component="img" height="140" image={getImage(id)} alt="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title} {id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        {expired < 0 ? (
          <Button size="small" variant="outlined">
            Inscrição
          </Button>
        ) : null}
        <Button size="small" onClick={() => push(`/tournament/${id}`)}>
          Saiba mais
        </Button>
      </CardActions>
    </Card>
  )
}