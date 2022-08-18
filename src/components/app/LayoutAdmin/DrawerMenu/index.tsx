import React from 'react'

import SendIcon from '@mui/icons-material/Send'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useRouter } from 'next/router'

import { useAdminMenu } from '../LayoutAdminProvider'
import { adminRoutes } from './adminRoutes'

type Props = {}
export const DrawerMenu: React.FC<Props> = () => {
  const [open, setOpen] = useAdminMenu()
  const { push } = useRouter()

  const handleClose = () => setOpen(false)

  const handleClick = (p: string) => {
    return () => {
      push(p)
      handleClose()
    }
  }

  return (
    <Drawer open={open} onClose={handleClose}>
      <List component="nav">
        {adminRoutes.map(({ id, path, label }) => {
          return (
            <ListItemButton key={`menu-item-${id}`} onClick={handleClick(path)}>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          )
        })}
      </List>
    </Drawer>
  )
}
