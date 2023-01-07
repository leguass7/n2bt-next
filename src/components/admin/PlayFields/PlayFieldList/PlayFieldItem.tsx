import { useMemo } from 'react'

import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import { Card, CardActions, CardHeader, Grid, IconButton, Typography } from '@mui/material'
import { isAfter, isBefore } from 'date-fns'
import Image from 'next/image'

import { formatPrice } from '~/helpers'
import type { PlayField } from '~/server-side/useCases/play-field/play-field.entity'

interface Props extends PlayField {
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

export const PlayFieldItem: React.FC<Props> = ({ id, label, startDate, endDate, price, onEdit, onDelete }) => {
  const isInUse = useMemo(() => {
    const now = new Date()

    return !!(isAfter(now, startDate) && isBefore(now, endDate))
  }, [startDate, endDate])

  const subheader = isInUse ? 'Em funcionamento' : 'Fora de horário'

  return (
    <Card>
      <CardHeader title={label} subheader={subheader} />
      <Image src="/layout.png" layout="responsive" width="80%" height={100} alt={label} />
      <CardActions>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body1">{formatPrice(price)}</Typography>
          </Grid>
          <Grid item>
            {onEdit ? (
              <IconButton onClick={() => onEdit(id)}>
                <Edit />
              </IconButton>
            ) : null}

            {onDelete ? (
              <IconButton onClick={() => onDelete(id)}>
                <Delete />
              </IconButton>
            ) : null}
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}
