import { ListItem, ListItemText, Typography } from '@mui/material'

import { PlayField } from '~/server-side/useCases/play-field/play-field.entity'

import { AppointmentChip } from '../../Appointment/AppointmentChip'

interface Props extends PlayField {}

export const PlayFieldSelectItem: React.FC<Props> = ({ label, id, appointments }) => {
  return (
    <ListItem>
      <ListItemText>
        <Typography pb={2} variant="h5">
          {label}
        </Typography>
        {appointments?.map(appointment => {
          return <AppointmentChip key={`field-${id}-appointment-${appointment?.id}`} {...appointment} />
        })}
      </ListItemText>
    </ListItem>
  )
}
