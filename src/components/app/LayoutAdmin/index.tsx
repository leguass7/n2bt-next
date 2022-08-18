import React, { useEffect } from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'

import { useAppAuth } from '~/hooks/useAppAuth'

type LayoutAdminProps = {
  children?: React.ReactNode
}

export const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  const { logOut, completedAuth, userData, loading } = useAppAuth()
  const { push } = useRouter()

  useEffect(() => {
    if (!completedAuth && !loading) push('/')
    else if (userData?.level < 8) {
      logOut()
    }
  }, [push, completedAuth, logOut, userData, loading])

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin
          </Typography>
          <Button color="inherit" onClick={() => logOut()}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </>
  )
}
