import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useResizeDetector } from 'react-resize-detector'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import { useRouter } from 'next/router'
import gfm from 'remark-gfm'

import { validDate } from '~/helpers/date'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'

import { MkContainer } from '../styled'
import { TournamentCardMedia } from '../TournamentCardMedia'
import { CollapseCharts } from './CollapseCharts'
import { ExpandMore } from './ExpandMore'

export type TournamentCardProps = Partial<ITournament> & {}

export const TournamentCard: React.FC<TournamentCardProps> = ({ id, title, description, expires, download, subscriptionEnd, limitUsers, arena }) => {
  const contentRef = useRef<HTMLDivElement>()
  const { ref, width } = useResizeDetector()

  const { prefetch } = useRouter()
  const [expanded, setExpanded] = useState(false)

  const expiresDate = validDate(expires)
  const subExpiresDate = validDate(subscriptionEnd)

  const expired = isPast(expiresDate) || isPast(subExpiresDate)

  useEffect(() => {
    prefetch(`/subscription?tournamentId=${id}`)
    prefetch(`/tournament/about/${id}`)
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
    <Card ref={ref}>
      <TournamentCardMedia tournamentId={id} width={width} />
      <CardContent>
        <div
          ref={contentRef}
          style={{ maxWidth: 290, maxHeight: expanded ? 'none' : 120, minHeight: 120, overflow: expanded ? 'visible' : 'hidden' }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <MkContainer>
            <ReactMarkdown remarkPlugins={[gfm]}>{description}</ReactMarkdown>
          </MkContainer>
        </div>
      </CardContent>
      <CardContent>
        <Chip color="secondary" variant="filled" size="small" label={arena?.title} />
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
      <CollapseCharts tournamentId={id} expanded={!!expanded} limitUsers={limitUsers} />
    </Card>
  )
}
