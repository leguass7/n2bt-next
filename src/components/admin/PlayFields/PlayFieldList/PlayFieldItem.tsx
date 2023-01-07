import { useMemo } from 'react'

import { Card, CardHeader } from '@mui/material'
import { isAfter, isBefore } from 'date-fns'
import Image from 'next/image'

import type { PlayField } from '~/server-side/useCases/play-field/play-field.entity'

interface Props extends PlayField {}

export const PlayFieldItem: React.FC<Props> = ({ label, startDate, endDate }) => {
  const isInUse = useMemo(() => {
    const now = new Date()

    return !!(isAfter(now, startDate) && isBefore(now, endDate))
  }, [startDate, endDate])

  const subheader = isInUse ? 'Em funcionamento' : 'Fora de horário'

  return (
    <Card>
      <CardHeader title={label} subheader={subheader} />
      <Image src="/layout.png" layout="responsive" width="80%" height={100} alt={label} />
    </Card>
  )
}
