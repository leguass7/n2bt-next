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

import { getTournamentImage } from '~/config/constants'
import { validDate } from '~/helpers/date'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'

import { MkContainer } from '../styled'

type Props = Partial<ITournament> & {}

export const TournamentCard: React.FC<Props> = ({ id, title, description, expires, subscriptionExpiration }) => {
  const { prefetch } = useRouter()

  const expiresDate = validDate(expires)
  const subExpiresDate = validDate(subscriptionExpiration)

  const expired = isPast(expiresDate) || isPast(subExpiresDate)

  useEffect(() => {
    prefetch(`/subscription?tournamentId=${id}`)
  }, [prefetch, id])

  return (
    <Card sx={{ maxWidth: 345, minWidth: 320 }}>
      <CardMedia component="img" height="140" image={getTournamentImage(id)} alt={title} />
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
          <Button
            size="small"
            variant="outlined"
            href={`/subscription?tournamentId=${id}`}
            //onClick={() => push(`/subscription/${id}`)}
          >
            Inscrição
          </Button>
        ) : null}
        <Button
          size="small"
          href={`/tournament/about/${id}`}
          //onClick={() => push(`/tournament/about/${id}`)}
        >
          Saiba mais
        </Button>
      </CardActions>
    </Card>
  )
}
