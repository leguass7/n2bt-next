import React, { useCallback, useMemo } from 'react'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import { useRouter } from 'next/router'

import { useAppArena } from '~/hooks/useAppArena'
import { useOnceCall } from '~/hooks/useOnceCall'

import { useAdminArena } from './LayoutAdminProvider'

type ListArenasProps = {
  onClick?: (id?: number) => void
}
const ListArenas: React.FC<ListArenasProps> = ({ onClick }) => {
  const [, setArenaId, list] = useAdminArena()

  const handleClick = useCallback(
    (id: number) => {
      return () => {
        setArenaId(id)
        if (onClick) onClick(id)
      }
    },
    [setArenaId, onClick]
  )

  return (
    <List disablePadding>
      {list.map(({ id, title }) => {
        return (
          <ListItemButton key={`menu-arena-${id}`} onClick={handleClick(id)}>
            <ListItemText primary={title} />
          </ListItemButton>
        )
      })}
    </List>
  )
}

export const SelectArena: React.FC = () => {
  const { pathname } = useRouter()
  const [arenaId, , arenas] = useAdminArena()
  const { requestListArenas } = useAppArena()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget), [])
  const handleClose = useCallback(() => setAnchorEl(null), [])

  const arenaSelected = useMemo(() => {
    return arenaId ? arenas?.find(f => f.id === arenaId) || null : null
  }, [arenaId, arenas])

  const [id, open] = useMemo(() => {
    return [open ? 'arena-popover' : undefined, Boolean(anchorEl)]
  }, [anchorEl])

  useOnceCall(() => {
    requestListArenas()
  })

  if (
    ['/admin/tournaments/ranking', '/admin/tournaments/subscriptions', '/admin/tournaments/sub-cards', '/admin/tournaments/checkin'].includes(
      pathname
    )
  ) {
    return <div style={{ flexGrow: 1 }} />
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <Button
        aria-describedby={id}
        color="secondary"
        variant="contained"
        onClick={handleClick}
        endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        {arenaSelected ? arenaSelected?.title : 'Arena'}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <ListArenas onClick={handleClose} />
      </Popover>
    </div>
  )
}
