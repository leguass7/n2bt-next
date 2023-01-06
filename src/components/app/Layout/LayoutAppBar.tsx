import React from 'react'

import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { LogoCEAHorizontal } from '~/components/svg/LogoCEAHorizontal'
import { useAppAuth } from '~/hooks/useAppAuth'

import { ProfilePopover } from './ProfilePopover'

export const LayoutAppBar: React.FC = () => {
  const { push } = useRouter()
  const { theme } = useAppTheme()
  const { completedAuth, logOut } = useAppAuth()
  // const [, setOpen] = useMenu()

  // const toogleMenu = () => setOpen(old => !old)

  const handleLoginClick = async () => {
    await logOut()
    push('/login')
  }

  return (
    <AppBar sx={{ backgroundColor: theme.colors.primary }}>
      <Toolbar sx={{ alignContent: 'center', alignItems: 'center' }}>
        {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toogleMenu}>
          <MenuIcon />
        </IconButton> */}
        <Link href={'/'} passHref>
          <a>
            <LogoCEAHorizontal color="#fff" height={50} white={theme.colors.primary} />
            {/* <Image width={64} height={64} layout="intrinsic" alt="Logo" src="/logo.png" /> */}
            {/* <LogoSvg height={48} color="#fff" /> */}
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
