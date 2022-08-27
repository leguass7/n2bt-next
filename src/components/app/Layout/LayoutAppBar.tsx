import React from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { LogoSvg } from '~/components/LogoSvg'
import { useAppAuth } from '~/hooks/useAppAuth'

import { useMenu } from './LayoutProvider'
import { ProfilePopover } from './ProfilePopover'

export const LayoutAppBar: React.FC = () => {
  const { push } = useRouter()
  const { theme } = useAppTheme()
  const { completedAuth } = useAppAuth()
  const [, setOpen] = useMenu()

  const toogleMenu = () => setOpen(old => !old)

  const handleLoginClick = () => {
    push('/login')
  }

  return (
    <AppBar sx={{ backgroundColor: theme.colors.primary }}>
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toogleMenu}>
          <MenuIcon />
        </IconButton>
        <Link href={'/'} passHref>
          <a>
            <LogoSvg height={52} color="#fff" />
          </a>
        </Link>
        <div style={{ flexGrow: 1 }}></div>
        {completedAuth ? (
          <ProfilePopover />
        ) : (
          <Button color="inherit" onClick={handleLoginClick} variant="outlined">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
