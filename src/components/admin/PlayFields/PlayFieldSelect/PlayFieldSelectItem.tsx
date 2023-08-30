import { useCallback } from 'react'

import { ListItem, ListItemButton, ListItemText } from '@mui/material'

import { type PlayField } from '~/server-side/useCases/play-field/play-field.entity'

interface Props extends PlayField {
  onSelect?: (id: number) => void
}

export const PlayFieldSelectItem: React.FC<Props> = ({ label, onSelect, id }) => {
  const handleClick = useCallback(
    (id: number) => () => {
      onSelect?.(id)
    },
    [onSelect]
  )

  return (
    <ListItem>
      <ListItemButton onClick={handleClick(id)}>
        <ListItemText>{label}</ListItemText>
      </ListItemButton>
    </ListItem>
  )
}
