import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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
import { CollapseCharts } from './CollapseCharts'
import { ExpandMore } from './ExpandMore'

type Props = Partial<ITournament> & {}

export const TournamentCard: React.FC<Props> = ({ id, title, description, expires, download, subscriptionExpiration }) => {
  const { prefetch } = useRouter()
  const [expanded, setExpanded] = useState(false)

  const expiresDate = validDate(expires)
  const subExpiresDate = validDate(subscriptionExpiration)

  const expired = isPast(expiresDate) || isPast(subExpiresDate)

  useEffect(() => {
    prefetch(`/subscription?tournamentId=${id}`)
  }, [prefetch, id])

  const handleExpandClick = () => setExpanded(old => !old)

  const renderMore = () => {
    if (download && !expired)
      return (
        <Button size="small" variant="outlined" href={`/${download}`} target="_blank" rel="noopener noreferrer">
          Regulamento
        </Button>
      )
    return (
      <Button size="small" href={`/tournament/about/${id}`}>
        Saiba mais
      </Button>
    )
  }

  return (
    <Card>
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
          <Button size="small" variant="outlined" href={`/subscription?tournamentId=${id}`}>
            Inscrição
          </Button>
        ) : null}
        {renderMore()}
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <CollapseCharts tournamentId={id} expanded={!!expanded} />
    </Card>
  )
}
