import React from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'

import { useAppAuth } from '~/hooks/useAppAuth'

import { useAdminMenu } from './LayoutAdminProvider'
import { SelectArena } from './SelectArena'

export const AdminAppBar: React.FC = () => {
  const { logOut } = useAppAuth()
  const [, setOpen] = useAdminMenu()

  const toogleMenu = () => setOpen(old => !old)

  return (
    <AppBar>
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toogleMenu}>
          <MenuIcon />
        </IconButton>
        <SelectArena />
        <Button color="inherit" onClick={() => logOut()}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  )
}
