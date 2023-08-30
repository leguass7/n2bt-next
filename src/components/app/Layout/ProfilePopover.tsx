import React, { type MouseEvent, useEffect, useState } from 'react'

import HomeIcon from '@mui/icons-material/Home'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import LogoutIcon from '@mui/icons-material/Logout'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant'
import SettingsIcon from '@mui/icons-material/Settings'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import { useRouter } from 'next/router'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { RippleBadge } from '~/components/RippleBadge'
import { Text } from '~/components/styled'
import { normalizeImageSrc } from '~/helpers/string'
import { useAppAuth } from '~/hooks/useAppAuth'

export const ProfilePopover: React.FC = () => {
  const { theme } = useAppTheme()
  const { userData, logOut } = useAppAuth()
  const { prefetch, push, asPath } = useRouter()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => setAnchorEl(null)

  const handleLogout = () => {
    handlePopoverClose()
    logOut()
  }

  const handleProfile = () => {
    handlePopoverClose()
    push('/me/register')
  }

  const open = Boolean(anchorEl)

  useEffect(() => {
    prefetch('/')
    prefetch('/register')
  }, [prefetch])

  const registerNotify = !!(asPath !== '/me/register' && userData && !userData?.completed)

  const renderSecondaryText = () => {
    if (!registerNotify) return 'Meu cadastro'
    return (
      <Text textColor={theme.colors.errors} textSize={12}>
        Complete seu cadastro para realizar a inscrição
      </Text>
    )
  }

  return (
    <>
      <IconButton onClick={handlePopoverOpen} sx={{ p: 0 }}>
        <RippleBadge disabled={!registerNotify}>
          <Avatar alt={userData?.name || ''} src={normalizeImageSrc(userData?.image || '')} sx={{ border: `2px solid ${theme.colors.white}` }} />
        </RippleBadge>
      </IconButton>
      <Popover
        id="click-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <List disablePadding sx={{ maxWidth: 240 }}>
          <ListItem disablePadding>
            <ListItemButton dense onClick={() => push('/')}>
              <ListItemIcon>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Página principal" secondary="Navegar para homepage" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton dense onClick={handleProfile}>
              <ListItemIcon>
                {registerNotify ? (
                  <NotificationImportantIcon fontSize="small" sx={{ color: theme.colors.errors }} />
                ) : (
                  <ManageAccountsIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText primary={userData?.name} secondary={renderSecondaryText()} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton dense onClick={() => push('/me/subscription')}>
              <ListItemIcon>
                <HowToRegIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Inscrições" secondary="Minhas inscrições" />
            </ListItemButton>
          </ListItem>
          {userData?.level >= 8 ? (
            <>
              <ListItem disablePadding>
                <ListItemButton dense onClick={() => push('/admin')}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Admin" secondary="Administrador" />
                </ListItemButton>
              </ListItem>
            </>
          ) : null}
          <Divider />
          <ListItem disablePadding>
            <ListItemButton dense onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sair" secondary="Realizar logoff" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  )
}
