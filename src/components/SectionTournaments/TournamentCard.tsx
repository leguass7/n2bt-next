import React, { useCallback, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useResizeDetector } from 'react-resize-detector'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import { useRouter } from 'next/router'
import gfm from 'remark-gfm'

import { getTournamentImage } from '~/config/constants'
import { round } from '~/helpers'
import { validDate } from '~/helpers/date'
import { useIsMounted } from '~/hooks/useIsMounted'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { getImageFromFeature } from '~/services/api/image'

import { CircleLoading } from '../CircleLoading'
import { MkContainer } from '../styled'
import { CollapseCharts } from './CollapseCharts'
import { ExpandMore } from './ExpandMore'

type Props = Partial<ITournament> & {}

export const TournamentCard: React.FC<Props> = ({ id, title, description, expires, download, subscriptionEnd, limitUsers, arena }) => {
  const { ref, width } = useResizeDetector()
  const { prefetch } = useRouter()
  const [expanded, setExpanded] = useState(false)

  const [image, setImage] = useState<string>(null)
  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const expiresDate = validDate(expires)
  const subExpiresDate = validDate(subscriptionEnd)

  const expired = isPast(expiresDate) || isPast(subExpiresDate)

  useEffect(() => {
    prefetch(`/subscription?tournamentId=${id}`)
  }, [prefetch, id])

  const fetchData = useCallback(async () => {
    if (!id) return null
    setLoading(true)
    const { success, images } = await getImageFromFeature('tournament', id)

    if (isMounted()) {
      setLoading(false)
      if (success && images?.length) setImage(images[0]?.url)
    }
  }, [id, isMounted])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  const getMediaHeight = () => {
    const w = round(width, 0)
    return round(w / 1.777777777777778, 0)
  }

  const src = image ? image : getTournamentImage(id)

  // console.log('width', width, getMediaWidth())
  return (
    <Card ref={ref}>
      <CardMedia component="img" height={getMediaHeight()} image={src} alt={title} />
      <CardContent>
        <div style={{ maxWidth: 290, maxHeight: expanded ? 'none' : 120, overflow: expanded ? 'visible' : 'hidden' }}>
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
            Inscri????o
          </Button>
        ) : null}
        {renderMore()}
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <CollapseCharts tournamentId={id} expanded={!!expanded} limitUsers={limitUsers} />

      {loading ? <CircleLoading /> : null}
    </Card>
  )
}
