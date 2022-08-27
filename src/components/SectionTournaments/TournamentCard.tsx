import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import { useRouter } from 'next/router'
import gfm from 'remark-gfm'

import img02 from '~/assets/original-1ano.jpg'
import img01 from '~/assets/primeira-speed.jpg'
import { validDate } from '~/helpers/date'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'

import { MkContainer } from './styles'

const images = [
  { id: 1, image: img01 },
  { id: 2, image: img02 }
  //
]

const getImage = (id: number) => {
  return images.find(f => f.id === id)?.image?.src || img01?.src
}

type Props = Partial<ITournament> & {}

export const TournamentCard: React.FC<Props> = ({ id, title, description, expires, subscriptionExpiration }) => {
  const { push, prefetch } = useRouter()

  const expiresDate = validDate(expires)
  const subExpiresDate = validDate(subscriptionExpiration)

  const expired = isPast(expiresDate) || isPast(subExpiresDate)

  useEffect(() => {
    prefetch(`/subscription/${id}`)
  }, [prefetch, id])

  return (
    <Card sx={{ maxWidth: 345, minWidth: 320 }}>
      <CardMedia component="img" height="140" image={getImage(id)} alt="green iguana" />
      <CardContent>
        <div style={{ maxWidth: 290 }}>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <MkContainer>
            <ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown>
          </MkContainer>
        </div>
      </CardContent>
      <CardActions>
        {!expired ? (
          <Button size="small" variant="outlined" onClick={() => push(`/subscription/${id}`)}>
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
