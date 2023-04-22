import React, { useState, useCallback, useEffect } from 'react'

import { CardMedia } from '@mui/material'

import { getTournamentImage } from '~/config/constants'
import { round } from '~/helpers'
import { useIsMounted } from '~/hooks/useIsMounted'
import { getImageByTournamentId } from '~/services/api/image'

// import { Container } from './styles';

type Props = {
  tournamentId: number
  width?: number
  title?: string
}

export const TournamentCardMedia: React.FC<Props> = ({ tournamentId, width = 290, title }) => {
  const isMounted = useIsMounted()
  const [, setLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>(null)

  const fetchData = useCallback(async () => {
    if (!tournamentId) return null
    setLoading(true)
    const { success, image } = await getImageByTournamentId(tournamentId)

    if (isMounted()) {
      setLoading(false)
      if (success && image) setImageSrc(image?.url)
    }
  }, [tournamentId, isMounted])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getMediaHeight = () => {
    const w = round(width, 0)
    return round(w / 1.777777777777778, 0)
  }

  const src = imageSrc ? imageSrc : getTournamentImage(tournamentId)

  return <CardMedia component="img" height={getMediaHeight()} image={src} alt={title} />
}
